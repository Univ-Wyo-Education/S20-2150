package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"runtime"
	"strconv"
	"strings"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/filelib"
	"github.com/pschlump/godebug"
)

// (in-prog) xyzzy400 - convert bytes of string into 0 term set of values (ASCII in memory and store) at pc...
// xyzzy421 - Add in --version
// xyzzy800 - Sort symbol table output before outputting
// xyzzy401 - ImplementDebugFlags

// ---------------------------------------------------------------------------------
// asm - MARIA assembler.
// ---------------------------------------------------------------------------------
// --in  FILE.mas	input .mas file
// --out FILE.hex	output assembled code
// --st  file.out   Symbol table output
// ---------------------------------------------------------------------------------

var In = flag.String("in", "", "Input File - assembly code.")
var Out = flag.String("out", "", "Output in hex.")
var DbFlag = flag.String("db-flag", "", "debug flags.") // xyzzy401 - TODO
var St = flag.String("st", "", "Output symbol table to file")

var stOut = os.Stdout

var OnWindows = false

func init() {
	if runtime.GOOS == "windows" {
		OnWindows = true
	}
}

func main() {

	flag.Parse() // Parse CLI arguments

	fns := flag.Args()

	if len(fns) > 0 {
		fmt.Fprintf(os.Stderr, "Invalid arguments\n")
		os.Exit(1)
	}

	// xyzzy401 - ImplementDebugFlags
	if *In == "" {
		fmt.Printf("Fatal: Required command line parameter --in FILE.mas is missing\n")
		os.Exit(1)
	}
	if *Out == "" {
		fmt.Printf("Fatal: Required command line parameter --out FILE.hex is missing\n")
		os.Exit(1)
	}

	fn := *In
	out := *Out

	if *St != "" {
		var err error
		stOut, err = filelib.Fopen(*St, "w")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Erorr oping symbol table output %s : error : %s\n", *St, err)
			os.Exit(1)
		}
	}

	// process lines in file...
	buf, err := ioutil.ReadFile(fn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to open %s - assembly language input file:%s\n", fn, err)
		os.Exit(1)
	}
	mes := string(buf)
	mes_lines := strings.Split(mes, "\n")

	n_err := 0

	// Pass 1
	pc := Mac.AddressType(0)
	for ii, line := range mes_lines {
		line_no := ii + 1

		if OnWindows {
			line = strings.TrimRight(line, "\r\n")
		}

		label, _ /*op_s*/, op, hand, err := ParseLine(line, line_no)
		if err != nil {
			n_err++
			fmt.Fprintf(os.Stderr, "%s\n", err)
			continue
		} else {
			if label != "" {
				err = AddSymbol(label, pc, line_no)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Duplicate Symbol: %s\n", err)
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
					fmt.Fprintf(os.Stderr, "Error: Line %d missing value after ORG - should be an address\n", line_no)
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

	if db1 {
		DumpSymbolTable(stOut)
	}

	memBuf := make([]int, pc, pc)

	// Pass 2
	pc = 0
	max_pc := Mac.AddressType(0)
	for ii, line := range mes_lines {
		line_no := ii + 1

		if OnWindows {
			line = strings.TrimRight(line, "\r\n")
		}

		_ /*label*/, _ /*op_s*/, op, hand, err := ParseLine(line, -line_no)
		if err != nil {
			// done in pass 1
			continue
		} else {

			switch op {
			case Mac.OpAdd:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpAdd, handVal)
				pc++
			case Mac.OpSubt:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpSubt, handVal)
				pc++
			case Mac.OpHalt:
				memBuf[pc] = ComposeInstruction(Mac.OpHalt, 0)
				pc++
			case Mac.OpLoad:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpLoad, handVal)
				pc++
			case Mac.OpStore:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpStore, handVal)
				pc++
			case Mac.OpInput:
				memBuf[pc] = ComposeInstruction(Mac.OpInput, 0)
				pc++
			case Mac.OpOutput:
				memBuf[pc] = ComposeInstruction(Mac.OpOutput, 0)
				pc++
			case Mac.OpJump:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpJump, handVal)
				pc++
			case Mac.OpJnS:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpJnS, handVal)
				pc++
			case Mac.OpClear:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpClear, handVal)
				pc++
			case Mac.OpSkipcond:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpSkipcond, handVal)
				if db7 {
					fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
				}
				pc++
				//case Mac.OpSkipLt0:
				//	memBuf[pc] = ComposeInstruction(Mac.OpSkipLt0, 0)
				//	pc++

			case Mac.OpSkipEq0:
				memBuf[pc] = ComposeInstruction(Mac.OpSkipEq0, 0)
				if db7 {
					fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
				}
				pc++
			case Mac.OpSkipGt0:
				memBuf[pc] = ComposeInstruction(Mac.OpSkipGt0, 0)
				if db7 {
					fmt.Printf("%sOpSkipGt0 - instruction: %x at:%s%s\n", MiscLib.ColorYellow, ComposeInstruction(Mac.OpSkipGt0, 0), godebug.LF(), MiscLib.ColorReset)
				}
				pc++
			case Mac.OpAddI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpAddI, handVal)
				pc++
			case Mac.OpJumpI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpJumpI, handVal)
				pc++
			case Mac.OpLoadI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpLoadI, handVal)
				pc++
			case Mac.OpStoreI:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpStoreI, handVal)
				pc++
			case Mac.DirORG:
				handVal, err := ConvHand(hand, 0)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing value after ORG - should be an address\n", line_no)
					n_err++
					continue
				}
				pc = Mac.AddressType(int(handVal))
			case Mac.DirDEC:
				handVal, err := ConvHand(hand, 10)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = int(handVal)
				pc++
			case Mac.DirHEX:
				if db5 {
					fmt.Printf("%sHEX [%s]%s\n", MiscLib.ColorRed, hand, MiscLib.ColorReset)
				}
				handVal, err := ConvHand(hand, 16)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = int(handVal)
				pc++
			case Mac.DirOCT:
				handVal, err := ConvHand(hand, 8)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = int(handVal)
				pc++
			case Mac.DirBIN:
				handVal, err := ConvHand(hand, 2)
				if err != nil {
					fmt.Fprintf(os.Stderr, "%s\n", err)
					continue
				}
				memBuf[pc] = int(handVal)
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
					memBuf[pc] = int(xx & 0xff)
					pc++
				}
				memBuf[pc] = 0
				pc++
			case Mac.DirCHR:
				memBuf[pc] = int(hand[0] & 0xff)
				pc++
			}
			max_pc = MaxAddress(max_pc, pc)
		}
	}

	// Output
	if n_err > 0 {
		fmt.Fprintf(os.Stderr, "%s# Of Errors: %d%s\n", MiscLib.ColorRed, n_err, MiscLib.ColorReset)
		fmt.Fprintf(os.Stderr, ".hex file may be incorrect\n")
	}
	outFp, err := filelib.Fopen(out, "w")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to open output file : %s error : %s\n", out, err)
		os.Exit(1)
	}
	for _, aaa := range memBuf {
		fmt.Fprintf(outFp, "%04x\n", uint(aaa)&0xffff)
	}
	outFp.Close()
	if n_err > 0 {
		os.Exit(3)
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parsing
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
func ParseLine(line string, line_no int) (label string, op_s string, op Mac.OpCodeType, hand string, err error) {
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

func DumpSymbolTable(fp *os.File) {
	// xyzzy800 - Sort symbol table output before outputting
	fmt.Fprintf(fp, "Symbol Table\n")
	fmt.Fprintf(fp, "-------------------------------------------------------------\n")
	for key, val := range SymbolTable {
		fmt.Fprintf(fp, "%s: %s\n", key, godebug.SVar(val))
	}
	fmt.Fprintf(fp, "-------------------------------------------------------------\n\n")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utitlieis
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ConvHand(hand string, base int) (handVal Mac.HandType, err error) {
	handVal = Mac.HandType(-1)
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

var db1 = true // Leave True
var db2 = true // Debug of Parsing code
var db8 = false
var db7 = false
var db5 = false // HEX directive w/ hex output
var db10 = true // test STR directive
var db12 = true // test STR directive
