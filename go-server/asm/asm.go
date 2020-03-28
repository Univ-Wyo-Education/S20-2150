package asm

// Assembler
// Copyright (C) University of Wyoming, 2019-2020.

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"os"
	"reflect"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/HashStrings"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/filelib"
	"github.com/pschlump/godebug"
	"gitlab.com/pschlump/PureImaginationServer/ymux"
)

// (in-prog) xyzzy400 - convert bytes of string into 0 term set of values (ASCII in memory and store) at pc...
// xyzzy421 - Add in --version
// xyzzy800 - Sort symbol table output before outputting
// xyzzy401 - ImplementDebugFlags
// remote@198.58.107.206
// http://www.2c-why.com/status
// http://www.2c-why.com/upload

var outPath string

func Setup(op string) {
	outPath = op
}

// _ /*hex*/, hashHex, stDump, err := asm.Asssemble(mes)
func MARIE_Assm(mes, out string) (n_err int, hex, hashHex, stList string, err error) {

	// fpList := (*os.File)(nil)
	var buffer bytes.Buffer
	var bufferList bytes.Buffer

	mes_lines := strings.Split(mes, "\n")

	n_err = 0

	// Pass 1
	pc := Mac.AddressType(0)
	for ii, line := range mes_lines {
		line_no := ii + 1

		line = strings.TrimRight(line, "\r\n")
		if line == "" {
			continue
		}

		label, _ /*op_s*/, op, hand, e0 := ParseLine(line, line_no)
		err = e0
		if err != nil {
			n_err++
			bufferList.WriteString(fmt.Sprintf("%s\n", err))
			continue
		} else {
			if label != "" {
				err = AddSymbol(label, pc, line_no)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("Duplicate Symbol: %s\n", err))
					n_err++
				}
			}

			switch op {
			case Mac.OpAdd:
				pc++
			case Mac.OpSubt:
				pc++
			case Mac.OpHalt:
				pc++
			case Mac.OpLoad:
				pc++
			case Mac.OpStore:
				pc++
			case Mac.OpInput:
				pc++
			case Mac.OpOutput:
				pc++
			case Mac.OpJump:
				pc++
			case Mac.OpJnS:
				pc++
			case Mac.OpClear:
				pc++
			case Mac.OpSkipcond:
				pc++
			//case Mac.OpSkipLt0:
			//	pc++
			case Mac.OpSkipEq0:
				pc++
			case Mac.OpSkipGt0:
				pc++
			case Mac.OpAddI:
				pc++
			case Mac.OpJumpI:
				pc++
			case Mac.OpLoadI:
				pc++
			case Mac.OpStoreI:
				pc++
			case Mac.DirORG:
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing value after ORG - should be an address\n", line_no))
					n_err++
					continue
				}
				handVal, _ := ConvHand(hand, 0)
				pc = Mac.AddressType(int(handVal))
			case Mac.DirDEC:
				pc++
			case Mac.DirHEX:
				pc++
			case Mac.DirOCT:
				pc++
			case Mac.DirBIN:
				pc++
			case Mac.DirSTR:
				for _, xx := range hand {
					_ = xx
					pc++
				}
				pc++
			case Mac.DirCHR:
				pc++
			}
		}
	}

	memBuf := make([]int, pc, pc)

	bufferList.WriteString(fmt.Sprintf("%-4s: %-6s %-4s %s\n", "Line", "Address", "Hex", "==============================================================="))

	// Pass 2
	pc = 0
	max_pc := Mac.AddressType(0)
	for ii, line := range mes_lines {
		line_no := ii + 1

		line = strings.TrimRight(line, "\r\n")
		if line == "" {
			bufferList.WriteString(fmt.Sprintf("%4d:\n", line_no))
			continue
		}

		op_gen := -1
		_ /*label*/, op_s, op, hand, e0 := ParseLine(line, -line_no)
		err = e0
		if err != nil {
			op_gen = -1
			// done in pass 1
			continue
		} else {

			switch op {
			case Mac.OpAdd:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing - should be an address\n", line_no))
					n_err++
					continue
				}
				op_gen = ComposeInstruction(Mac.OpAdd, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpSubt:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing - should be an address\n", line_no))
					n_err++
					continue
				}
				op_gen = ComposeInstruction(Mac.OpSubt, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpHalt:
				op_gen = ComposeInstruction(Mac.OpHalt, 0)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpLoad:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing - should be an address\n", line_no))
					n_err++
					continue
				}
				op_gen = ComposeInstruction(Mac.OpLoad, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpStore:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing - should be an address\n", line_no))
					n_err++
					continue
				}
				op_gen = ComposeInstruction(Mac.OpStore, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpInput:
				op_gen = ComposeInstruction(Mac.OpInput, 0)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpOutput:
				op_gen = ComposeInstruction(Mac.OpOutput, 0)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpJump:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpJump, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpJnS:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpJnS, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpClear:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpClear, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpSkipcond:
				if db21 {
					fmt.Printf("%sop_s ->%s<- at:%s%s\n", MiscLib.ColorRed, op_s, godebug.LF(), MiscLib.ColorReset)
				}
				if op_s == "skiplt0" {
					//case Mac.OpSkipLt0:
					op_gen = ComposeInstruction(Mac.OpSkipLt0, 0)
					memBuf[pc] = op_gen
					pc++
				} else {
					handVal, err := ConvHand(hand, 0)
					// fmt.Printf("    handval=%x %d\n", handVal, handVal)
					if err != nil {
						bufferList.WriteString(fmt.Sprintf("%s\n", err))
						continue
					}
					op_gen = ComposeInstruction(Mac.OpSkipcond, handVal)
					memBuf[pc] = op_gen
					if db7 {
						fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
					}
					pc++
				}

			case Mac.OpSkipEq0:
				if db21 {
					fmt.Printf("%sop_s ->%s<- at:%s%s\n", MiscLib.ColorRed, op_s, godebug.LF(), MiscLib.ColorReset)
				}
				op_gen = ComposeInstruction(Mac.OpSkipEq0, 0)
				memBuf[pc] = op_gen
				if db7 {
					fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
				}
				pc++
			case Mac.OpSkipGt0:
				if db21 {
					fmt.Printf("%sop_s ->%s<- at:%s%s\n", MiscLib.ColorRed, op_s, godebug.LF(), MiscLib.ColorReset)
				}
				op_gen = ComposeInstruction(Mac.OpSkipGt0, 0)
				memBuf[pc] = op_gen
				if db7 {
					fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
				}
				pc++
			case Mac.OpAddI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpAddI, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpJumpI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpJumpI, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpLoadI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpLoadI, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.OpStoreI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = ComposeInstruction(Mac.OpStoreI, handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.DirORG:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				if hand == "" {
					bufferList.WriteString(fmt.Sprintf("Error: Line %d missing value after ORG - should be an address\n", line_no))
					n_err++
					continue
				}
				pc = Mac.AddressType(int(handVal))
			case Mac.DirDEC:
				handVal, err := ConvHand(hand, 10)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = int(handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.DirHEX:
				if db5 {
					fmt.Printf("%sHEX [%s]%s\n", MiscLib.ColorRed, hand, MiscLib.ColorReset)
				}
				handVal, err := ConvHand(hand, 16)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = int(handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.DirOCT:
				handVal, err := ConvHand(hand, 8)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = int(handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.DirBIN:
				handVal, err := ConvHand(hand, 2)
				if err != nil {
					bufferList.WriteString(fmt.Sprintf("%s\n", err))
					continue
				}
				op_gen = int(handVal)
				memBuf[pc] = op_gen
				pc++
			case Mac.DirSTR:
				// xyzzy400 - convert bytes of string into 0 term set of values (ASCII in memory and store) at pc...
				if db10 {
					fmt.Printf("%s--- DirSTR pass 2 hand ->%s<- --- at:%s%s\n", MiscLib.ColorYellow, godebug.LF(), hand, MiscLib.ColorReset)
				}
				for _, xx := range hand {
					if db10 {
						fmt.Printf("\tPut in at [%04d/0x%04x] value [%02x][%c]\n", pc, pc, (xx & 0xff), rune(xx&0xff))
					}
					op_gen = int(xx & 0xff)
					memBuf[pc] = op_gen
					pc++
				}
				op_gen = 0
				memBuf[pc] = op_gen
				pc++
			case Mac.DirCHR:
				op_gen = int(hand[0] & 0xff)
				memBuf[pc] = op_gen
				pc++
			}
			max_pc = MaxAddress(max_pc, pc)
		}
		if op_gen == -1 {
			bufferList.WriteString(fmt.Sprintf("%4d: 0x%04x %4s %s\n", line_no, pc, "", line))
		} else {
			bufferList.WriteString(fmt.Sprintf("%4d: 0x%04x %04x %s\n", line_no, pc, op_gen&0xffff, line))
		}
	}

	bufferList.WriteString("\n")

	DumpSymbolTable(&bufferList)

	// Output
	if n_err > 0 {
		bufferList.WriteString(fmt.Sprintf("%s# Of Errors: %d%s\n", MiscLib.ColorRed, n_err, MiscLib.ColorReset))
		bufferList.WriteString(fmt.Sprintf(".hex file may be incorrect\n"))
	}
	out = fmt.Sprintf("%s/%s", outPath, out) // put the output in the path.
	outFp, err := filelib.Fopen(out, "w")
	if err != nil {
		bufferList.WriteString(fmt.Sprintf("Unable to open output file : %s error : %s\n", out, err))
		return
	}
	defer outFp.Close()
	for _, aaa := range memBuf {
		buffer.WriteString(fmt.Sprintf("%04x\n", uint(aaa)&0xffff))
	}
	if n_err > 0 {
		return
	}

	data, err := ioutil.ReadFile(out)
	if err != nil {
		fmt.Printf("Error: (Unable to Upload to S3) failed to re-read output: file: %s error:%s\n", out, err)
		os.Exit(1)
	}
	hashHex = HashByesReturnHex(data)
	hex = string(data)

	// var bufferList bytes.Buffer
	stList = bufferList.String()

	return
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parsing
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
func ParseLine(line string, line_no int) (label string, op_s string, op Mac.OpCodeType, hand string, err error) {
	op = Mac.OpN_A
	godebug.DbPf(db2 || db8, "%s\nline[%d]=->%s<-%s at:%s\n", MiscLib.ColorCyan, line_no, line, MiscLib.ColorReset, godebug.LF())
	r1 := regexp.MustCompile("^[a-zA-Z_][a-zA-Z0-9_]*,")
	r1a := regexp.MustCompile("^[a-zA-Z_][a-zA-Z0-9_]*")
	r1b := regexp.MustCompile("^[a-zA-Z_][a-zA-Z0-9_]*,[ \t]*")
	r1c := regexp.MustCompile("^[ \t]*")
	if r1.MatchString(line) {
		label = r1a.FindString(line)
		godebug.DbPf(db2, "%slable=%s%s at:%s\n", MiscLib.ColorYellow, label, MiscLib.ColorReset, godebug.LF())
		t1 := r1b.FindString(line)
		line = line[len(t1):]
		godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
	} else {
		t1 := r1c.FindString(line)
		line = line[len(t1):]
		godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
	}
	r2 := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9]*")
	r2b := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9]*[ \t]*")
	if r2.MatchString(line) {
		op_s = r2.FindString(line)
		godebug.DbPf(db12 || db8, "%sRaw: op_s=%s%s at:%s\n", MiscLib.ColorYellow, op_s, MiscLib.ColorReset, godebug.LF())
		op_s = strings.ToLower(op_s)
		godebug.DbPf(db12 || db8, "%sLC : op_s=%s%s at:%s\n", MiscLib.ColorYellow, op_s, MiscLib.ColorReset, godebug.LF())
		godebug.DbPf(db2 || db8, "%sop_s=%s%s at:%s\n", MiscLib.ColorYellow, op_s, MiscLib.ColorReset, godebug.LF())
		t1 := r2b.FindString(line)
		line = line[len(t1):]
		godebug.DbPf(db2, "rest of line->%s<- after op_s match. AT:%s\n", line, godebug.LF())

		var ok bool
		if op, ok = Mac.OpTab[op_s]; line_no > 0 && !ok {
			err = fmt.Errorf("Invalid opcode ->%s<- found on line %d\n", op_s, line_no)
		}

		if db8 {
			fmt.Printf("%s  AT: %s op_s ->%s<- op = 0x%x%s\n", MiscLib.ColorCyan, godebug.LF(), op_s, int(op), MiscLib.ColorReset)
		}

		if op_s == "chr" {
			if db2 {
				fmt.Printf("%s  AT: %s op_s ->%s<- op = 0x%x%s\n", MiscLib.ColorCyan, godebug.LF(), op_s, int(op), MiscLib.ColorReset)
			}
			r4 := regexp.MustCompile("^'.'")
			r3 := regexp.MustCompile("^[^/']*")
			r3b := regexp.MustCompile("^[^/ \t]*[ \t]*")
			if r4.MatchString(line) {
				hand = r3.FindString(line[1:])
				hand = hand
				godebug.DbPf(db2, "%shand=%s%s at:%s\n", MiscLib.ColorYellow, hand, MiscLib.ColorReset, godebug.LF())
				t1 := r3b.FindString(line)
				line = line[len(t1):]
				godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
			}
		} else if op_s == "str" {
			if db2 {
				fmt.Printf("%s  AT: %s op_s ->%s<- op = 0x%x%s\n", MiscLib.ColorCyan, godebug.LF(), op_s, int(op), MiscLib.ColorReset)
			}
			r4 := regexp.MustCompile("^\"[^\"]*\"")
			r3 := regexp.MustCompile("^[^/\"]*")
			r3b := regexp.MustCompile("^[^/ \t]*[ \t]*")
			if r4.MatchString(line) {
				hand = r3.FindString(line[1:])
				hand = hand
				godebug.DbPf(db2, "%shand=%s%s at:%s\n", MiscLib.ColorYellow, hand, MiscLib.ColorReset, godebug.LF())
				t1 := r3b.FindString(line)
				line = line[len(t1):]
				godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
			}
		} else {
			if db2 {
				fmt.Printf("%s  AT: %s op_s ->%s<- op = 0x%x%s\n", MiscLib.ColorCyan, godebug.LF(), op_s, int(op), MiscLib.ColorReset)
			}
			r4 := regexp.MustCompile("^[a-zA-Z0-9]*")
			r3 := regexp.MustCompile("^[^/\n \t]*")
			r3b := regexp.MustCompile("^[^/ \t]*[ \t]*")
			if r4.MatchString(line) {
				hand = r3.FindString(line)
				godebug.DbPf(db2, "%shand=%s%s at:%s\n", MiscLib.ColorYellow, hand, MiscLib.ColorReset, godebug.LF())
				t1 := r3b.FindString(line)
				line = line[len(t1):]
				godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
			}
		}
	}
	return
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Symbol table
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SymbolTableType struct {
	Name    string
	LineNo  int
	Address Mac.AddressType // -1 indicates that this is not an assigned address yet
}

var SymbolTable map[string]SymbolTableType

func init() {
	SymbolTable = make(map[string]SymbolTableType)
}

func AddSymbol(Name string, pc Mac.AddressType, line_no int) (err error) {
	if ss, found := SymbolTable[Name]; !found {
		SymbolTable[Name] = SymbolTableType{
			Name:    Name,
			LineNo:  line_no,
			Address: pc,
		}
	} else {
		err = fmt.Errorf("Duplicate symbol found.  Original line: %d Current %d - Symbol : %s\n", ss.LineNo, line_no, Name)
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

func DumpSymbolTable(buffer *bytes.Buffer) {
	// xyzzy800 - Sort symbol table output before outputting
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
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utitlieis
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ConvHand(hand string, base int) (handVal Mac.HandType, err error) {
	hand = strings.TrimRight(hand, "\r\n \t")
	handVal = Mac.HandType(0)
	if hand != "" {
		st, e1 := LookupSymbol(hand)
		if e1 == nil {
			handVal = Mac.HandType(int(st.Address))
			return
		}

		if base == 16 {
			hv, e0 := strconv.ParseInt(hand, 16, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		} else if base == 10 {
			hv, e0 := strconv.ParseInt(hand, 10, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		} else if base == 8 {
			hv, e0 := strconv.ParseInt(hand, 8, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		} else if base == 2 {
			hv, e0 := strconv.ParseInt(hand, 2, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		} else if strings.HasPrefix(hand, "0b") && len(hand) > 2 {
			hv, e0 := strconv.ParseInt(hand[2:], 2, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		} else {
			hv, e0 := strconv.ParseInt(hand, 0, 32)
			if e0 != nil {
				err = fmt.Errorf("Invalid conversion of value.  Found ->%s<- should be 0xHex, 0Oct, or Decimal or Label address: %s\n", hand, e0)
				return
			}
			handVal = Mac.HandType(hv)
		}
	}
	return
}

func ComposeInstruction(Op Mac.OpCodeType, hand Mac.HandType) (ins int) {
	// ins = int(((uint(Op) & 0xf) << 12) | (uint(hand) & 0xfff))
	ins = int(uint(Op) | (uint(hand) & 0xfff))
	return
}

func MaxAddress(a, b Mac.AddressType) Mac.AddressType {
	if a > b {
		return a
	}
	return b
}

func HashByesReturnHex(data []byte) (s string) {
	h := HashStrings.HashByte(data)
	s = hex.EncodeToString(h)
	return
}

var db2 = false // Debug of Parsing code		// xyzzy
var db8 = false
var db7 = false
var db5 = false  // HEX directive w/ hex output
var db10 = false // test STR directive
var db12 = false // test STR directive
var db14 = false // DOS
var db21 = false // Upload flags
