package mcasm

// Microcode Assembler
// Microcode Assembler
// Copyright (C) University of Wyoming, 2019-2020.

import (
	"bytes"
	"encoding/hex"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"reflect"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/HashStrings"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
	"gitlab.com/pschlump/PureImaginationServer/ymux"
)

// xyzzy421 - Add in --version
// xyzzy401 - ImplementDebugFlags
// xyzzy442 - var DbFlag = flag.String("db-flag", "", "debug flags.") // xyzzy401 - TODO

// /version API end point

var cfgAwsUsed = false

// ---------------------------------------------------------------------------------
// asm - MARIA assembler.
// ---------------------------------------------------------------------------------
// --in  FILE.mas	input .mas file
// --out FILE.hex	output assembled code
// --st  file.out   Symbol table output
// ---------------------------------------------------------------------------------

var In = flag.String("in", "", "Input File - microcode assembly code. (microcode.mm)")
var Out = flag.String("out", "", "Output in hex. Loadable Microcode .hex file")
var IdList = flag.String("id-list", "id-list.txt", "List of Valid IDs in hardware")
var St = flag.String("st", "", "Output symbol table to file")
var Upload = flag.Bool("upload", false, "Upload the microcode.hex to Amazon S3://")
var Help = flag.Bool("help", false, "Help Printout")
var Version = flag.Bool("version", false, "Print out version of build and exit.")

var Server = flag.String("server", "http://www.2c-why.com/", "Destination server to send upload to")

// var Server = flag.String("server", "http://localhost:10000/", "Destination server to send upload to")
var AuthKey = flag.String("auth_key", "V7luOm6qurGREm1Ts2W2epA0KrM=", "Authorization Key")

var stOut = os.Stdout

var idList map[string]bool

func Setup(fn string) {
	idList = GetIDsFromSVG(fn) // "./www/mm_machine.html")
}

// mes - the posted body of the assembley file.
func Asssemble(mes string) (nEx int, hex, hashHex, stDump string, err error) {

	var buffer bytes.Buffer

	mes_lines := strings.Split(mes, "\n")

	n_err := 0
	n_ins := 0

	memBuf0 := make([]uint64, 256, 256) // Memory is 256 address, 64 wide
	memBufs := make([]string, 256, 256) // Memory is 256 address, 64 wide

	mpc := 0
	for ii, line := range mes_lines {
		line_no := ii + 1

		line = strings.TrimRight(line, "\r\n")
		line = removeComment(line)
		line = strings.TrimRight(line, "\r\n")
		if line == "" {
			continue
		}

		// Type of Parsed Lines

		symbols, op_s, ss, err := ParseLine(line, line_no)
		_, _, _ = symbols, op_s, err
		if symbols == nil || len(symbols) == 0 || (len(symbols) == 1 && symbols[0] == "") {
			if db16 {
				fmt.Printf("%sSkippign Empty Line%s\n", MiscLib.ColorGreen, MiscLib.ColorReset)
			}
			continue
		}

		if op_s == "__end__" {
			break
		}
		if op_s == "DCL" {
			for _, ss := range symbols[1:] {
				AddSymbol(ss, line_no, true)
			}
			continue
		} else if op_s == "ORG" {
			if len(symbols) >= 1 {
				mpc = convertAddr(symbols[1], line_no)
			} else {
				fmt.Printf("Missing address for ORG, Line %d\n", line_no)
			}
			continue
		} else if op_s == "STR" {
			if db15 {
				fmt.Printf("Symbols %s\n", symbols)
			}
			// STR will put a string into the MC memory as a comment.
			for ii, eu := range As64BitWords(ss) {
				if db15 {
					fmt.Printf("Word[%d] = %x\n", ii, eu)
				}
				if eu != 0 {
					memBuf0[mpc&0xff] = eu
					mpc++
				}
			}
			continue
		}

		for _, ss := range symbols {
			AddSymbol(ss, line_no, false)
		}

		eu := uint64(0)

		for _, ss := range symbols {
			st, err := LookupSymbol(ss)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Invalid symbol [%s] was not found, line %d\n", ss, line_no)
			} else {
				eu = eu | (1 << st.Address)
			}

		}

		n_ins++
		memBuf0[mpc&0xff] = eu
		memBufs[mpc&0xff] = fmt.Sprintf("LineNo: %d %s", line_no, line)
		mpc++

	}

	nEx = n_ins

	if db1000 {
		fmt.Fprintf(stOut, "# Of Instructions: %d\n", n_ins)
	}
	stDump = DumpSymbolTable(stOut)

	// Output
	if n_err > 0 {
		fmt.Fprintf(os.Stderr, "%s# Of Errors: %d%s\n", MiscLib.ColorRed, n_err, MiscLib.ColorReset)
		fmt.Fprintf(os.Stderr, ".hex file may be incorrect\n")
	}
	var s string
	for ii, aaa := range memBuf0 {
		s = fmt.Sprintf("%016x %03d/%02x %s\n", aaa, ii, ii, memBufs[ii])
		buffer.WriteString(s)
	}
	buffer.WriteString("##1\n")
	DumpSymbolTableForHexFile(&buffer)
	buffer.WriteString("##2\n")
	s = fmt.Sprintf("// Input File: %s\n", *In)
	buffer.WriteString(s)
	t := time.Now()
	s = fmt.Sprintf("// Assembled At: %s\n", t.Format("2006-01-02T15:04:05-0700"))
	buffer.WriteString(s)

	hex = buffer.String() // hex - is the generated .hex file data

	if n_err > 0 {
		err = fmt.Errorf("Errors found: %d", n_err)
		return
	}

	CheckIds(idList)

	hashHex = HashByesReturnHex([]byte(hex)) // hash of the file - to write it.

	// err = ioutil.WriteFile(fmt.Sprintf("./www/data/%s.txt", hashHex), []byte(hex), 0644)
	// _ = err // xyzzy1

	if db1001 {
		fmt.Printf("Hash To Enter to Load the Microcode into the Emulator:\n\t%s\n\n", hashHex)
	}

	return
}

// 1. Find every line with id="..."
// 2. Extract the "ID"
// 3. Process "xxx[4]" into "xxx_0", "xxx_1" etc.
func GetIDsFromSVG(HTMLFile string) (outIdList map[string]bool) {
	outIdList = make(map[string]bool)
	data, err := ioutil.ReadFile(HTMLFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: Unable to open %s error: %s\n", HTMLFile, err)
		os.Exit(1)
	}

	hasId := regexp.MustCompile("<.*id=\"[^\"]*\"")
	getId := regexp.MustCompile("id=\"[^\"]*\"")
	hasRange := regexp.MustCompile("\\[[0-9][0-9]*\\]")
	rangeAtEnd := regexp.MustCompile("\\[[0-9][0-9]*\\]$")
	getRange := regexp.MustCompile("\\[[0-9][0-9]*\\]")
	getNum := getRange
	for LineNo, bLine := range strings.Split(string(data), "\n") {
		Line := string(bLine)
		if hasId.MatchString(Line) {
			s2 := getId.FindAllStringSubmatch(Line, -1)
			if len(s2) == 0 {
				fmt.Fprintf(os.Stderr, "Error: Failed to match ->%s<- for ID, LineNo:%d, at:%s\n", Line, LineNo, godebug.LF())
			}
			if db810 {
				fmt.Printf("SUccess: %s\n", godebug.SVarI(s2[0][0]))
			}
			idS := s2[0][0]
			idS = idS[4 : len(idS)-1]
			if db810 {
				fmt.Printf("SUCcess: ->%s<-\n", idS)
			}
			outIdList[idS] = true

			// check for [n] in ID - if found then replace with 0..n-1
			if hasRange.MatchString(idS) {
				if db810 {
					fmt.Printf("%sHas a Range in it... ->%s<-%s\n", MiscLib.ColorYellow, idS, MiscLib.ColorReset)
				}
				if rangeAtEnd.MatchString(idS) {
					s3 := getNum.FindAllStringSubmatch(idS, -1)
					s3num := s3[0][0]
					s3num = s3num[1 : len(s3num)-1]
					num, err := strconv.ParseInt(s3num, 10, 64)
					if err != nil {
						fmt.Printf("Error: Invalid number ->%s<- LineNo: %d error:%s\n", s3num, LineNo, err)
					} else {
						begArr := strings.Split(idS, "[")
						beg := begArr[0]
						for i := 0; i < int(num); i++ {
							outIdList[fmt.Sprintf("%s_%d", beg, i)] = true
						}
					}
				} else {
					s3 := getNum.FindAllStringSubmatch(idS, -1)
					s3num := s3[0][0]               // get the [n]
					s3num = s3num[1 : len(s3num)-1] // get the n
					num, err := strconv.ParseInt(s3num, 10, 64)
					if err != nil {
						fmt.Printf("Error: Invalid number ->%s<- LineNo: %d error:%s\n", s3num, LineNo, err)
					} else {
						begArr := strings.Split(idS, "[")
						beg := begArr[0]
						endArr := strings.Split(idS, "]")
						end := endArr[1]
						for i := 0; i < int(num); i++ {
							outIdList[fmt.Sprintf("%s_%d_%s", beg, i, end)] = true
						}
					}
				}
			}
		}
	}
	return
}

// idList :=  ReadIdList ( *IdList )
func ReadIdList(IdListFn string) (rv map[string]bool) {
	rv = make(map[string]bool)
	rv["_"] = true
	data, err := ioutil.ReadFile(IdListFn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Missing %s file, error:%s\n", IdListFn, err)
		return
	}
	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		line = strings.TrimRight(line, "\r\n")
		rv[line] = true
	}
	return
}

func As64BitWords(s string) (rv []uint64) {
	b := []byte(s)
	var i, j = 0, 0
	var ee uint64 = 0
	for i < len(b) {
		j = i
		k := 0
		for k < 8 && j < len(b) {
			ee = (ee << 8) | (uint64(b[j]) & 0xff)
			j++
			k++
		}
		for k < 8 {
			ee = (ee << 8)
			k++
		}
		rv = append(rv, ee)
		i += 8
	}
	return
}

func convertAddr(h string, line_no int) int {
	if len(h) > 2 && h[0:2] == "0b" {
		h = h[2:]
		h = strings.Replace(h, "_", "", -1)
		rv, err := strconv.ParseInt(h, 2, 64)
		if err != nil {
			fmt.Printf("invalid binary number [%s], line no:%d\n", h, line_no)
		}
		return int(rv) & 0xff
	} else if len(h) > 2 && h[0:2] == "0x" {
		h = h[2:]
		h = strings.Replace(h, "_", "", -1)
		rv, err := strconv.ParseInt(h, 16, 64)
		if err != nil {
			fmt.Printf("invalid binary number [%s], line no:%d\n", h, line_no)
		}
		return int(rv) & 0xff
	} else if len(h) > 1 && h[0:1] == "0" || len(h) > 2 && h[0:2] == "0o" {
		h = h[2:]
		h = strings.Replace(h, "_", "", -1)
		rv, err := strconv.ParseInt(h, 8, 64)
		if err != nil {
			fmt.Printf("invalid binary number [%s], line no:%d\n", h, line_no)
		}
		return int(rv) & 0xff
	} else {
		fmt.Printf("Invalid - ORG should be followd by a 0x000000000 address, line_no:%d\n", line_no)
	}
	return 0
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parsing
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
func ParseLine(line string, line_no int) (symbols []string, op_s string, ss string, err error) {

	symbols = []string{}

	// ORG <value>
	// Symbol  Symbol Symbol
	//
	// #define Name Value
	// Symbol = ID
	r := regexp.MustCompile("[^\\s]+")
	symbols = r.FindAllString(line, -1)

	if len(symbols) > 0 && strings.ToLower(symbols[0]) == "org" {
		op_s = "ORG"
	} else if len(symbols) > 0 && strings.ToLower(symbols[0]) == "dcl" {
		op_s = "DCL"
	} else if len(symbols) > 0 && strings.ToLower(symbols[0]) == "str" {
		op_s = "STR"
		ss = strings.Join(symbols[1:], " ")
	} else if len(symbols) > 0 && strings.ToLower(symbols[0]) == "__end__" {
		op_s = "__end__"
	} else {
		op_s = "1"
	}

	if db16 {
		fmt.Printf("symbols ->%s<- op %s\n", godebug.SVar(symbols), op_s)
	}

	return
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Symbol table
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SymbolTableType struct {
	Name     string
	LineNo   []int
	Address  int
	Declared bool
}

var SymbolTable map[string]SymbolTableType
var SymbolAddress int

func init() {
	SymbolTable = make(map[string]SymbolTableType)
	SymbolAddress = 0
}

func AddSymbol(Name string, line_no int, Dcl bool) (err error) {
	if ss, found := SymbolTable[Name]; !found {
		if !Dcl {
			fmt.Fprintf(os.Stderr, "%sFound non-declared symbol (%s) on line %d%s\n", MiscLib.ColorRed, Name, line_no, MiscLib.ColorReset)
		}
		SymbolTable[Name] = SymbolTableType{
			Name:     Name,
			LineNo:   []int{line_no},
			Address:  SymbolAddress,
			Declared: Dcl,
		}
		SymbolAddress++
	} else {
		ss.LineNo = append(ss.LineNo, line_no)
		SymbolTable[Name] = ss
	}
	return
}

func LookupSymbol(Name string) (st SymbolTableType, err error) {
	var ok bool
	st, ok = SymbolTable[Name]
	if !ok {
		err = fmt.Errorf("Not Found")
	}
	return
}

// KeysFromMap returns an array of keys from a map.
//
// This is used like this:
//
//	keys := KeysFromMap(nameMap)
//	sort.Strings(keys)
//	for _, key := range keys {
//		val := nameMap[key]
//		...
//	}
//
func KeysFromMap(a interface{}) (keys []string) {
	xkeys := reflect.ValueOf(a).MapKeys()
	keys = make([]string, len(xkeys))
	for ii, vv := range xkeys {
		keys[ii] = vv.String()
	}
	return
}

func DumpSymbolTable(fp *os.File) string {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintf("Symbol Table\n"))
	buffer.WriteString(fmt.Sprintf("-------------------------------------------------------------\n"))
	keys := ymux.KeysFromMap(SymbolTable)
	sort.Strings(keys)
	// for key, val := range SymbolTable {
	for _, key := range keys {
		val := SymbolTable[key]
		buffer.WriteString(fmt.Sprintf("%s: %s\n", key, godebug.SVar(val)))
	}
	buffer.WriteString(fmt.Sprintf("-------------------------------------------------------------\n\n"))
	return buffer.String()
}

func DumpSymbolTableForHexFile(buffer *bytes.Buffer) {
	keys := ymux.KeysFromMap(SymbolTable)
	sort.Strings(keys)
	// for key, val := range SymbolTable {
	for _, key := range keys {
		val := SymbolTable[key]
		s := fmt.Sprintf("%s %d\n", key, val.Address)
		buffer.WriteString(s)
	}
}

func CheckIds(idList map[string]bool) {
	keys := ymux.KeysFromMap(SymbolTable)
	sort.Strings(keys)
	// for key, val := range SymbolTable {
	for _, key := range keys {
		val := SymbolTable[key]
		if !idList[key] {
			fmt.Fprintf(os.Stderr, "%sId %s Used Line %d - Not found in SVG%s\n", MiscLib.ColorRed, key, val.LineNo, MiscLib.ColorReset)
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utitlieis
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func MaxAddress(a, b Mac.AddressType) Mac.AddressType {
	if a > b {
		return a
	}
	return b
}

func removeComment(line string) (rv string) {
	rv = line
	for i := range line {
		if line[i] == '/' {
			return line[0:i]
		}
	}
	return
}

func HashByesReturnHex(data []byte) (s string) {
	h := HashStrings.HashByte(data)
	s = hex.EncodeToString(h)
	return
}

var db1 = true  // Leave True
var db2 = false // Debug of Parsing code		// xyzzy
var db8 = false
var db7 = false
var db5 = false  // HEX directive w/ hex output
var db10 = false // test STR directive
var db12 = false // test STR directive
var db14 = false // DOS
var db15 = false // DOS
var db16 = false //
var db20 = true
var db810 = false
var db1000 = false
var db1001 = false
