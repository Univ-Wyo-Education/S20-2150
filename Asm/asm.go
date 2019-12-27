package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/filelib"
	"github.com/pschlump/godebug"
)

// xyzzy200 - $include$ - with an include path --path ./inc

// xyzzy400 - convert bytes of string into 0 term set of values (ASCII in memory and store) at pc...

var In = flag.String("in", "", "Input File - assembly code.")
var Out = flag.String("out", "", "Output in hex.")
var IncPath = flag.String("inc_path", "./inc", "Path for include diretives") // xyzzy200
var DbFlag = flag.String("db-flag", "", "debug flags.")                      // xyzzy401 - TODO

func main() {

	flag.Parse() // Parse CLI arguments

	fns := flag.Args()

	if len(fns) > 0 {
		fmt.Fprintf(os.Stderr, "Invalid arguments\n")
		os.Exit(1)
	}

	// xyzzy401 - ImplementDebugFlags

	fn := *In
	out := *Out

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

		label, _ /*op_s*/, op, hand, err := ParseLine(line, line_no)
		if err != nil {
			n_err++
			fmt.Fprintf(os.Stderr, "%s\n", err)
			continue
		} else {
			handVal, _ := ConvHand(hand)

			if label != "" {
				err = AddSymbol(label, pc, line_no)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Duplicate Symbol: %s\n", err)
					n_err++
				}
			}

			switch op {
			case Mac.OpAdd:
				pc += 1
			case Mac.OpSubt:
				pc += 1
			case Mac.OpHalt:
				pc += 1
			case Mac.OpLoad:
				pc += 1
			case Mac.OpStore:
				pc += 1
			case Mac.OpInput:
				pc += 1
			case Mac.OpOutput:
				pc += 1
			case Mac.OpJump:
				pc += 1
			case Mac.OpJnS:
				pc += 1
			case Mac.OpClear:
				pc += 1
			case Mac.OpSkipcond:
				pc += 1
			//case Mac.OpSkipLt0:
			//	pc += 1
			case Mac.OpSkipEq0:
				pc += 1
			case Mac.OpSkipGt0:
				pc += 1
			case Mac.OpAddI:
				pc += 1
			case Mac.OpJumpI:
				pc += 1
			case Mac.OpLoadI:
				pc += 1
			case Mac.OpStoreI:
				pc += 1
			case Mac.DirORG:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing value after ORG - should be an address\n", line_no)
					n_err++
					continue
				}
				pc = Mac.AddressType(int(handVal))
			case Mac.DirDEC:
				pc += 1
			case Mac.DirHEX:
				pc += 1
			case Mac.DirOCT:
				pc += 1
			case Mac.DirBIN:
				pc += 1
			case Mac.DirSTR:
				pc += 1
			}
		}
	}

	if db1 {
		DumpSymbolTable()
	}

	memBuf := make([]int, pc, pc)

	// Pass 2
	pc = 0
	max_pc := Mac.AddressType(0)
	for ii, line := range mes_lines {
		line_no := ii + 1

		_ /*label*/, _ /*op_s*/, op, hand, err := ParseLine(line, -1)
		if err != nil {
			// done in pass 1
			continue
		} else {
			handVal, err := ConvHand(hand)
			if err != nil {
				fmt.Fprintf(os.Stderr, "%s\n", err)
				continue
			}

			switch op {
			case Mac.OpAdd:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpAdd, handVal)
				pc += 1
			case Mac.OpSubt:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpSubt, handVal)
				pc += 1
			case Mac.OpHalt:
				memBuf[pc] = ComposeInstruction(Mac.OpHalt, 0)
				pc += 1
			case Mac.OpLoad:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpLoad, handVal)
				pc += 1
			case Mac.OpStore:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing - should be an address\n", line_no)
					n_err++
					continue
				}
				memBuf[pc] = ComposeInstruction(Mac.OpStore, handVal)
				pc += 1
			case Mac.OpInput:
				memBuf[pc] = ComposeInstruction(Mac.OpInput, 0)
				pc += 1
			case Mac.OpOutput:
				memBuf[pc] = ComposeInstruction(Mac.OpOutput, 0)
				pc += 1
			case Mac.OpJump:
				memBuf[pc] = ComposeInstruction(Mac.OpJump, handVal)
				pc += 1
			case Mac.OpJnS:
				memBuf[pc] = ComposeInstruction(Mac.OpJnS, handVal)
				pc += 1
			case Mac.OpClear:
				memBuf[pc] = ComposeInstruction(Mac.OpClear, handVal)
				pc += 1
			case Mac.OpSkipcond:
				memBuf[pc] = ComposeInstruction(Mac.OpSkipcond, handVal)
				pc += 1
			//case Mac.OpSkipLt0:
			//	memBuf[pc] = ComposeInstruction(Mac.OpSkipLt0, 0)
			//	pc += 1
			case Mac.OpSkipEq0:
				memBuf[pc] = ComposeInstruction(Mac.OpSkipEq0, 0)
				pc += 1
			case Mac.OpSkipGt0:
				memBuf[pc] = ComposeInstruction(Mac.OpSkipGt0, 0)
				pc += 1
			case Mac.OpAddI:
				memBuf[pc] = ComposeInstruction(Mac.OpAddI, handVal)
				pc += 1
			case Mac.OpJumpI:
				memBuf[pc] = ComposeInstruction(Mac.OpJumpI, handVal)
				pc += 1
			case Mac.OpLoadI:
				memBuf[pc] = ComposeInstruction(Mac.OpLoadI, handVal)
				pc += 1
			case Mac.OpStoreI:
				memBuf[pc] = ComposeInstruction(Mac.OpStoreI, handVal)
				pc += 1
			case Mac.DirORG:
				if hand == "" {
					fmt.Fprintf(os.Stderr, "Error: Line %d missing value after ORG - should be an address\n", line_no)
					n_err++
					continue
				}
				pc = Mac.AddressType(int(handVal))
			case Mac.DirDEC:
				// convert Dec -> word and store at pc
				vv, err := strconv.ParseInt(hand, 10, 32)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Conversion error, input ->%s<- error:%s\n", hand, err)
					n_err++
				}
				memBuf[pc] = int(vv)
				pc += 1
			case Mac.DirHEX:
				// convert Hex -> word and store at pc
				vv, err := strconv.ParseInt(hand, 16, 32)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Conversion error, input ->%s<- error:%s\n", hand, err)
					n_err++
				}
				memBuf[pc] = int(vv)
				pc += 1
			case Mac.DirOCT:
				// convert Oct -> word and store at pc
				vv, err := strconv.ParseInt(hand, 8, 32)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Conversion error, input ->%s<- error:%s\n", hand, err)
					n_err++
				}
				memBuf[pc] = int(vv)
				pc += 1
			case Mac.DirBIN:
				// convert Bin -> word and store at pc
				vv, err := strconv.ParseInt(hand, 2, 32)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Conversion error, input ->%s<- error:%s\n", hand, err)
					n_err++
				}
				memBuf[pc] = int(vv)
				pc += 1
			case Mac.DirSTR:
				// xyzzy400 - convert bytes of string into 0 term set of values (ASCII in memory and store) at pc...
				pc += 1
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
	r1 := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9_]*,")
	r1a := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9_]*")
	r1b := regexp.MustCompile("^[a-zA-Z][a-zA-Z0-9_]*,[ \t]*")
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
	r2 := regexp.MustCompile("^[a-zA-Z]*")
	r2b := regexp.MustCompile("^[a-zA-Z]*[ \t]*")
	if r2.MatchString(line) {
		op_s = r2.FindString(line)
		godebug.DbPf(db2 || db8, "%sop_s=%s%s at:%s\n", MiscLib.ColorYellow, op_s, MiscLib.ColorReset, godebug.LF())
		t1 := r2b.FindString(line)
		line = line[len(t1):]
		godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())

		var ok bool
		if op, ok = Mac.OpTab[op_s]; line_no > 0 && !ok {
			err = fmt.Errorf("Invalid opcode ->%s<- found on line %d\n", op_s, line_no)
		}

		if db8 {
			fmt.Printf("%s  AT: %s op_s ->%s<- op = 0x%x%s\n", MiscLib.ColorCyan, godebug.LF(), op_s, int(op), MiscLib.ColorReset)
		}

		r3 := regexp.MustCompile("^[^/\n \t]*")
		r3b := regexp.MustCompile("^[^/ \t]*[ \t]*")
		if r2.MatchString(line) {
			hand = r3.FindString(line)
			godebug.DbPf(db2, "%shand=%s%s at:%s\n", MiscLib.ColorYellow, hand, MiscLib.ColorReset, godebug.LF())
			t1 := r3b.FindString(line)
			line = line[len(t1):]
			godebug.DbPf(db2, "line->%s<- at:%s\n", line, godebug.LF())
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

func DumpSymbolTable() {
	fmt.Printf("Symbol Table\n")
	fmt.Printf("-------------------------------------------------------------\n")
	for key, val := range SymbolTable {
		fmt.Printf("%s: %s\n", key, godebug.SVar(val))
	}
	fmt.Printf("-------------------------------------------------------------\n\n")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utitlieis
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ConvHand(hand string) (handVal Mac.HandType, err error) {
	handVal = Mac.HandType(-1)
	if hand != "" {
		st, e1 := LookupSymbol(hand)
		if e1 == nil {
			handVal = Mac.HandType(int(st.Address))
			return
		}

		if strings.HasPrefix(hand, "0b") && len(hand) > 2 {
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

var db1 = true
var db2 = false // Debug of Parsing code
var db8 = false
