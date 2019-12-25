package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"testing"

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
			Run:         false,
			Fn:          "./test/scan_000.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_000.json",
		},
		{
			Run:         false,
			Fn:          "./test/scan_001.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_001.json",
		},
		{
			Run:         false,
			Fn:          "./test/scan_nope.txt",
			ErrExpected: true,
		},
		{
			Run:         false,
			Fn:          "./test/scan_002.txt",
			ErrExpected: false,
			Ref:         "./ref/scan_002.json",
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
		pt, err := Scanner(test.Fn)
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
			Run:         false,
			Fn:          "./test/scan_000.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_000.json",
		},
		{ /* 1 */
			Run:         false,
			Fn:          "./test/scan_004.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_001.json",
		},
		{ /* 2 */
			Run:         false,
			Comment:     `Test of increment.  Needs to check that the incremented value is a LValue in expression.  Note: All PtID's are LValues!  Value needs to be modified and saved.`,
			Fn:          "./test/scan_005.txt",
			ErrExpected: false,
			Ref:         "./ref/ast_002.json",
		},
		{ /* 3 */
			Run:         false,
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
	}

	for nn, test := range Tests {
		if !test.Run {
			fmt.Printf("Test skipped - run is false %d, at:%s\n", nn, godebug.LF())
			continue
		}
		tk, err := Scanner(test.Fn)
		if err != nil {
			if !test.ErrExpected {
				t.Errorf("[%d] Error not expected, got one:%s ", nn, err)
			}
			continue
		}

		if db0a {
			fmt.Printf("%s\n", godebug.SVarI(tk))
		}

		pd := ParseData{
			FileName: test.Fn,
			LineNo:   1,
			curPos:   0, // Start at beginning
			tokens:   tk,
			errList:  []string{},
		}

		astList := make([]*ParseTree, 0, 10)

		for {
			// 	cmp.go: 584: func ParseInput(pd *ParseData) (pt *ParseTree, err error) {
			ast, err := ParseInput(&pd)
			if ast == nil {
				break
			}

			if err != nil {
				// xyzzy - handle better
				t.Errorf("[%d] Error on parse\n", nn)
				// continue // xyzzy - handle better
			}
			if len(pd.errList) > 0 {
				fmt.Printf("error list = %s\n", pd.errList)
			}

			astList = append(astList, ast)

			if db1 {
				fmt.Printf("parse (ast) = %s\n", godebug.SVarI(ast))
			}

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

// Test ReWrite3_Incr_Decr(&a1)
// Also tests: TypeCheck1_Incr_Decr(a1, &errList)
func Test_TreeRewrite01(t *testing.T) {

	Tests := []struct {
		Run         bool
		Comment     string
		Pos         int
		Fn          string
		ErrExpected bool
		Ref         string
	}{
		{ /* 0 */
			Run:         false,
			Comment:     `Test of increment.  Needs to check that the incremented value is a LValue in expression.  Note: All PtID's are LValues!  Value needs to be modified and saved.`,
			Fn:          "./test/scan_005.txt",
			Pos:         1,
			ErrExpected: false,
			Ref:         "./ref/rr0_000.json",
		},
	}

	for nn, test := range Tests {
		if !test.Run {
			fmt.Printf("Test skipped - run is false %d, at:%s\n", nn, godebug.LF())
			continue
		}
		tk, err := Scanner(test.Fn)
		if err != nil {
			if !test.ErrExpected {
				t.Errorf("[%d] Error not expected, got one:%s ", nn, err)
			}
			continue
		}

		if db0a {
			fmt.Printf("%s\n", godebug.SVarI(tk))
		}

		// Build the AST array - so we can look at rewrite
		pd := ParseData{
			FileName: test.Fn,
			LineNo:   1,
			curPos:   0, // Start at beginning
			tokens:   tk,
			errList:  []string{},
		}
		astList := make([]*ParseTree, 0, 10)
		for {
			// 	cmp.go: 584: func ParseInput(pd *ParseData) (pt *ParseTree, err error) {
			ast, err := ParseInput(&pd)
			if ast == nil {
				break
			}

			if err != nil {
				// xyzzy - handle better
				t.Errorf("[%d] Error on parse\n", nn)
				// continue // xyzzy - handle better
			}
			if len(pd.errList) > 0 {
				fmt.Printf("error list = %s\n", pd.errList)
			}

			astList = append(astList, ast)

			if db4 {
				fmt.Printf("parse Before Rewrite (ast) = %s\n", godebug.SVarI(ast))
			}

		}

		a1 := astList[test.Pos] // Pick out the corret tree to test on.
		if db8 {
			fmt.Printf("parse Before Rewrite (ast) = %s\n", godebug.SVarI(a1))
		}
		var errList []string
		TypeCheck1_Incr_Decr(a1, &errList)
		if len(errList) == 0 {
			if test.ErrExpected == true {
				t.Errorf("[%d] Expected Error - did not get one.", nn)
			} else {
				ReWrite3_Incr_Decr(&a1)
				if db8 {
					fmt.Printf("AST After Rewrite (ast) = %s\n", godebug.SVarI(a1))
				}
			}
		} else {
			if test.ErrExpected == true {
			} else {
				t.Errorf("[%d] (got type errors when not expected to have errors) Type Error:%s.", nn, errList)
			}
		}

		have := godebug.SVarI(a1)
		ioutil.WriteFile(fmt.Sprintf("./out/rr0_%03d.json", nn), []byte(have), 0644)

		cmd0 := fmt.Sprintf("/Users/pschlump/bin/jd -q -c out/rr0_%03d.json ref/rr0_%03d.json", nn, nn)
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

func Test_TemporaryGeneration01(t *testing.T) {
	// func gen_AssignConstants(ast *ParseTree, kk *int) {
}

func Test_CodeGen_01_GenerateVariables(t *testing.T) {
}

var db0 = false // Dump tokens in Scanner Test
var db0a = true // Dump tokens in Parser Test (same as db0, but in Parser Test)
var db1 = true  // Dump AST in from Parser test in JSON
var db4 = false //
var db8 = true  //
