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
			Run:         false,
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

		for rv := 1; rv != LEX_EOF; {
			rv = exprParse(lexx)
			fmt.Printf("%srv= %T / %v at:%s%s\n", MiscLib.ColorRed, rv, rv, godebug.LF(), MiscLib.ColorReset)
		}

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

//old//// Test ReWrite3_Incr_Decr(&a1)
//old//// Also tests: TypeCheck1_Incr_Decr(a1, &errList)
//old//func Test_TreeRewrite01(t *testing.T) {
//old//
//old//	Tests := []struct {
//old//		Run         bool
//old//		Comment     string
//old//		Pos         int
//old//		Fn          string
//old//		ErrExpected bool
//old//		Ref         string
//old//	}{
//old//		{ /* 0 */
//old//			Run:         false,
//old//			Comment:     `Test of increment.  Needs to check that the incremented value is a LValue in expression.  Note: All PtID's are LValues!  Value needs to be modified and saved.`,
//old//			Fn:          "./test/scan_005.txt",
//old//			Pos:         1,
//old//			ErrExpected: false,
//old//			Ref:         "./ref/rr0_000.json",
//old//		},
//old//	}
//old//
//old//	for nn, test := range Tests {
//old//		if !test.Run {
//old//			fmt.Printf("Test skipped - run is false %d, at:%s\n", nn, godebug.LF())
//old//			continue
//old//		}
//old//		tk, _, err := Scanner(test.Fn)
//old//		if err != nil {
//old//			if !test.ErrExpected {
//old//				t.Errorf("[%d] Error not expected, got one:%s ", nn, err)
//old//			}
//old//			continue
//old//		}
//old//
//old//		if db0a {
//old//			fmt.Printf("%s\n", godebug.SVarI(tk))
//old//		}
//old//
//old//		// Build the AST array - so we can look at rewrite
//old//		pd := ParseData{
//old//			FileName: test.Fn,
//old//			LineNo:   1,
//old//			curPos:   0, // Start at beginning
//old//			tokens:   tk,
//old//			errList:  []string{},
//old//		}
//old//		astList := make([]*ParseTree, 0, 10)
//old//		for {
//old//			// 	cmp.go: 584: func ParseInput(pd *ParseData) (pt *ParseTree, err error) {
//old//			ast, err := ParseInput(&pd)
//old//			if ast == nil {
//old//				break
//old//			}
//old//
//old//			if err != nil {
//old//				// xyzzy - handle better
//old//				t.Errorf("[%d] Error on parse\n", nn)
//old//				// continue // xyzzy - handle better
//old//			}
//old//			if len(pd.errList) > 0 {
//old//				fmt.Printf("error list = %s\n", pd.errList)
//old//			}
//old//
//old//			astList = append(astList, ast)
//old//
//old//			if db4 {
//old//				fmt.Printf("parse Before Rewrite (ast) = %s\n", godebug.SVarI(ast))
//old//			}
//old//
//old//		}
//old//
//old//		a1 := astList[test.Pos] // Pick out the corret tree to test on.
//old//		if db8 {
//old//			fmt.Printf("parse Before Rewrite (ast) = %s\n", godebug.SVarI(a1))
//old//		}
//old//		var errList []string
//old//		TypeCheck1_Incr_Decr(a1, &errList)
//old//		if len(errList) == 0 {
//old//			if test.ErrExpected == true {
//old//				t.Errorf("[%d] Expected Error - did not get one.", nn)
//old//			} else {
//old//				ReWrite3_Incr_Decr(&a1)
//old//				if db8 {
//old//					fmt.Printf("AST After Rewrite (ast) = %s\n", godebug.SVarI(a1))
//old//				}
//old//			}
//old//		} else {
//old//			if test.ErrExpected == true {
//old//			} else {
//old//				t.Errorf("[%d] (got type errors when not expected to have errors) Type Error:%s.", nn, errList)
//old//			}
//old//		}
//old//
//old//		have := godebug.SVarI(a1)
//old//		ioutil.WriteFile(fmt.Sprintf("./out/rr0_%03d.json", nn), []byte(have), 0644)
//old//
//old//		cmd0 := fmt.Sprintf("/Users/pschlump/bin/jd -q -c out/rr0_%03d.json ref/rr0_%03d.json", nn, nn)
//old//		cmdS := strings.Split(cmd0, " ")
//old//
//old//		out, err := exec.Command(cmdS[0], cmdS[1:]...).Output()
//old//		if err != nil {
//old//			t.Errorf("[%d] error on exec! err:%s.", nn, err)
//old//		}
//old//		if string(out) != "" {
//old//			t.Errorf("[%d] Failed ->%s<-\n", nn, out)
//old//			fmt.Fprintf(os.Stderr, "%s", out)
//old//		}
//old//	}
//old//
//old//}
//old//
//old//func Test_TemporaryGeneration01(t *testing.T) {
//old//	// func gen_AssignConstants(ast *ParseTree, kk *int) {
//old//}
//old//
//old//func Test_CodeGen_01_GenerateVariables(t *testing.T) {
//old//}

var db0 = false // Dump tokens in Scanner Test
var db0a = true // Dump tokens in Parser Test (same as db0, but in Parser Test)
var db1 = true  // Dump AST in from Parser test in JSON
var db4 = false //
var db8 = true  //
