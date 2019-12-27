package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"testing"

	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
)

func Test_Scanner01(t *testing.T) {
	// func ParseLine(line string, pc AddressType) (label string, op_s string, op OpCodeType, hand string, err error)
	Tests := []struct {
		Run         bool
		Fn          string
		ErrExpected bool
		Ref         string
	}{
		{
			Run:         true,
			Fn:          "./test/scan_000.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_000.json",
		},
		{
			Run:         true,
			Fn:          "./test/scan_001.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_001.json",
		},
		{
			Run:         true,
			Fn:          "./test/scan_nope.txt",
			ErrExpected: true,
		},
		{
			Run:         true,
			Fn:          "./test/scan_003.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_003.json",
		},
	}

	var ReadToks = func(fn string) (rv []ScanTokType, err error) {
		buf, e0 := ioutil.ReadFile(fn)
		if e0 != nil {
			err = e0
			return
		}
		err = json.Unmarshal(buf, &rv)
		return
	}

	for nn, test := range Tests {
		if !test.Run {
			fmt.Printf("Test skipped - run is false %d, at:%s\n", nn, godebug.LF())
			continue
		}
		// func Scanner(fn string) (rv []ScanTokType, err error) {
		pt, _, err := Scanner(test.Fn)
		if err != nil {
			if !test.ErrExpected {
				t.Errorf("[%d] Error not expected, got one:%s ", nn, err)
			}
			continue
		}
		if db0 {
			fmt.Printf("%s\n", godebug.SVarI(pt))
		}
		expect, err := ReadToks(test.Ref)
		if err != nil {
			t.Errorf("[%d] Error Missing/Invalid test reference file %s: error %s\n", nn, test.Ref, err)
			continue
		}
		if len(expect) != len(pt) {
			t.Errorf("[%d] Error Expectd %d tokens, got %d", nn, len(expect), len(pt))
		}

		ss := godebug.SVarI(pt)
		ioutil.WriteFile(fmt.Sprintf("./out/scan_%03d.json", nn), []byte(ss), 0644)

		for ii := 0; ii < len(expect) && ii < len(pt); ii++ {
			exp := godebug.SVar(expect[ii])
			have := godebug.SVar(pt[ii])
			if exp != have {
				t.Errorf("[%d] Error Nth(%d) token expected ->%s<- got ->%s<-    use ` jd -q -c ./out/scan_%03d.json ./ref/scan_%03d.json ` to compare.", nn, ii, exp, have, nn, nn)
			}
		}
	}

}

// 1. Test Parser
// 	cmp.go: 584: func ParseInput(pd *ParseData) (pt *ParseTree, err error) {

func Test_Parser01(t *testing.T) {
	// 	cmp.go: 584: func ParseInput(pd *ParseData) (pt *ParseTree, err error) {
	Tests := []struct {
		Run         bool
		Comment     string
		Fn          string
		ErrExpected bool
		Ref         string
	}{
		{ /* 0 */
			Run:         true,
			Fn:          "./test/scan_000.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_000.json",
		},
		{ /* 1 */
			Run:         true,
			Fn:          "./test/scan_004.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_001.json",
		},
		{ /* 2 */
			Run:         true,
			Comment:     `Test of increment.  Needs to check that the incremented value is a LValue in expression.  Note: All PtID's are LValues!  Value needs to be modified and saved.`,
			Fn:          "./test/scan_005.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_002.json",
		},
		{ /* 3 */
			Run:         true,
			Comment:     `Test of decrement as an expression without assignment.  Value needs to be modified and saved.`,
			Fn:          "./test/scan_006.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_003.json",
		},
		{ /* 4 */
			Run:         true,
			Fn:          "./test/scan_007.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_004.json",
		},
		{ /* 4 */
			Run:         true,
			Fn:          "./test/parse_001.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_005.json",
		},
	}

	for nn, test := range Tests {
		if !test.Run {
			fmt.Printf("Test skipped - run is false %d, at:%s\n", nn, godebug.LF())
			continue
		}
		tk, _ /*raw*/, err := Scanner(test.Fn)
		if err != nil {
			if !test.ErrExpected {
				t.Errorf("[%d] Error not expected, got one:%s ", nn, err)
			}
			continue
		}

		if db0a {
			fmt.Printf("Tokens that have been scanned: %s\n", godebug.SVarI(tk))
		}

		pd := ParseData{
			FileName: test.Fn,
			LineNo:   1,
			curPos:   0, // Start at beginning
			tokens:   tk,
			errList:  []string{},
		}
		lexx = &exprLex{Tokens: tk, Pd: pd}

		astList = make([]*SyntaxTree, 0, 10)
		rv := exprParse(lexx)
		if db2 {
			fmt.Printf("%srv= %T / %v at:%s%s\n", MiscLib.ColorRed, rv, rv, godebug.LF(), MiscLib.ColorReset)
		}

		// xyzzy -should check tathat we are at TokEOF!

		if len(pd.errList) > 0 {
			fmt.Printf("error list = %s\n", lexx.Pd.errList)
		}
		if db1 {
			fmt.Printf("%sparse (ast) = %s at:%s%s\n", MiscLib.ColorYellow, godebug.SVarI(astList), godebug.LF(), MiscLib.ColorReset)
		}
		have := godebug.SVarI(astList)
		have2 := fmt.Sprintf(`{"x":%s}`, have)
		ioutil.WriteFile(fmt.Sprintf("./out/ast_%03d.json", nn), []byte(have2), 0644)

		cmd0 := fmt.Sprintf("/Users/pschlump/bin/jd -q -c out/ast_%03d.json ref/ast_%03d.json", nn, nn)
		cmdS := strings.Split(cmd0, " ")

		out, err := exec.Command(cmdS[0], cmdS[1:]...).Output()
		if err != nil {
			t.Errorf("[%d] error on exec! err:%s.", nn, err)
		}
		if string(out) != "" {
			t.Errorf("[%d] Failed ->%s<-\n", nn, out)
			fmt.Fprintf(os.Stderr, "%s", out)
		}
	}

}

var db0 = false  // Dump tokens in Scanner Test
var db0a = false // Dump tokens in Parser Test (same as db0, but in Parser Test)
var db1 = false  // Dump AST in from Parser test in JSON
var db2 = false  //
var db4 = false  //
var db8 = true   //
