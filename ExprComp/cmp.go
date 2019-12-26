package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/filelib"
	"github.com/pschlump/godebug"
)

const (
	// Scanner Tokens
	TokID      = TokType(ID)  // [a-zA-Z][a-zA-Z0-9_$]*
	TokEq      = TokType('=') // =
	TokInput   = TokType('I') // 'in'
	TokOutput  = TokType('P') // 'put'
	TokLP      = TokType('(') // '('
	TokRP      = TokType(')') // ')'
	TokPlus    = TokType('+') // '+'
	TokMinus   = TokType('-') // '-'
	TokMul     = TokType('*') // '*'
	TokU_Minus = TokType(10)  // '-' Inferred in grammar, Never scanned.
	TokIncr    = TokType('i') // '++'
	TokDecr    = TokType('d') // '--'
	TokNum     = TokType(NUM) // Number / Constant
	TokSem     = TokType(';') // ';'
	TokEOF     = TokType(0)   // Magic EOF token

	// Tokens used in the parser and parse trees.
	PtExpr    = TokType(300) // ParseTree	-- Expression - Left is child
	PtInput   = TokType(301) // ParseTree  -- Perform input on symbol
	PtOutput  = TokType(302) // ParseTree	-- Perform output on symbol
	PtU_Minus = TokType(303) // ParseTree	-- Unary Minus - Left is chiild
	PtNum     = TokType(304) // ParseTree	-- Constant / Number
	PtID      = TokType(305) // ParseTree	-- Identifier
	PtError   = TokType(306) // ParseTree	-- Error in tree node.
	PtAdd     = TokType(307) // ParseTree	-- Binary '+'
	PtSub     = TokType(308) // ParseTree	-- Binary '-'
	PtMul     = TokType(309) // ParseTree	-- Binary '*'
	PtIncr    = TokType(310) // ParseTree	-- Postfix Unary '++'
	PtDecr    = TokType(311) // ParseTree	-- Postfix Unary '--'
	PtLoad    = TokType(312) // ParseTree	-- Load from Memory
	PtStore   = TokType(313) // ParseTree	-- Save to Memroy
)

type ScanTokType struct {
	Tok     TokType
	TokName string
	SM      string `json:",omitempty"` // String Matched (for IDs and Numbers)
	Name    string `json:",omitempty"`
	Value   int
	LineNo  int
}

type ParseData struct {
	FileName string
	LineNo   int
	Value    int
	Name     int
	curPos   int
	tokens   []ScanTokType
	errList  []string
	ast      *SyntaxTree // Completed Parse Tree
}

type ParseTree struct {
	Op     TokType
	OpName string `json:",omitempty"`
	St     SymbolTableType
	Name   string `json:",omitempty"`
	Value  int
	Left   *ParseTree `json:",omitempty"`
	Right  *ParseTree `json:",omitempty"`
	LineNo int
	InAcc  bool
	Source string `json:",omitempty"`
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scanner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
	'='
	';'
	'('
	')'
	'+'
	'-'
	'*'
	'-'
	'++'
	'--'
	Number
	ID
	'input'
	'output'
*/

func Scanner(fn string) (rv []ScanTokType, raw []byte, err error) {
	buf, e0 := ioutil.ReadFile(fn)
	if e0 != nil {
		err = fmt.Errorf("Input from %s error %s", fn, e0)
		return
	}
	raw = buf

	errList := make([]string, 0, 2)

	// implement with DFA
	st := 0
	var cc byte
	pos := 0
	line_no := 1
	col_no := 0
	var tbuf bytes.Buffer

	var saveId = func() {
		ID := tbuf.String()
		tbuf.Reset()
		if ID == "in" {
			rv = append(rv, ScanTokType{Tok: TokInput, LineNo: line_no, TokName: TokInput.String(), SM: ID})
		} else if ID == "put" {
			rv = append(rv, ScanTokType{Tok: TokOutput, LineNo: line_no, TokName: TokOutput.String(), SM: ID})
		} else {
			rv = append(rv, ScanTokType{Tok: TokID, Name: ID, LineNo: line_no, TokName: TokID.String(), SM: ID})
		}
	}
	var saveNum = func() {
		Num := tbuf.String()
		tbuf.Reset()
		var nn int64
		if len(Num) > 2 && Num[0:2] == "0b" {
			nn, err = strconv.ParseInt(Num[2:], 2, 32)
		} else {
			nn, err = strconv.ParseInt(Num, 0, 32)
		}
		if err != nil {
			errList = append(errList, fmt.Sprintf("Scanning Error: Line: %d Col %d Invalid Number ->%s<-", line_no, col_no, Num))
		}
		rv = append(rv, ScanTokType{Tok: TokNum, Value: int(nn), LineNo: line_no, TokName: TokNum.String(), SM: Num})
	}

Loop:
	for {
		if pos < len(buf) {
			cc = buf[pos]
			if dbScanner01 {
				fmt.Printf("Scanner: Top: pos=%d buf ->%s<- cc %s\n", pos, buf[:pos], string(cc))
			}
			pos++
			col_no++
		} else {
			break Loop
		}

		var Backup1_GotoSt0 = func() {
			pos--
			col_no--
			st = 0
		}
		switch st {
		case 0: // Get Input

			switch {
			case cc == '\n':
				line_no++
				col_no = 0
			case cc == ' ' || cc == '\t':
			case cc == ';':
				rv = append(rv, ScanTokType{Tok: TokSem, LineNo: line_no, TokName: TokSem.String()})
			case cc == '=':
				rv = append(rv, ScanTokType{Tok: TokEq, LineNo: line_no, TokName: TokEq.String()})
			case cc == '(':
				rv = append(rv, ScanTokType{Tok: TokLP, LineNo: line_no, TokName: TokLP.String()})
			case cc == ')':
				rv = append(rv, ScanTokType{Tok: TokRP, LineNo: line_no, TokName: TokRP.String()})
			case cc == '*':
				rv = append(rv, ScanTokType{Tok: TokMul, LineNo: line_no, TokName: TokMul.String()})
			case cc == '+':
				st = 1
			case cc == '-':
				st = 2
			case (cc >= 'a' && cc <= 'z') || (cc >= 'A' && cc <= 'Z'): // ID or 'in' or 'put'
				tbuf.WriteByte(cc)
				st = 30
			case cc >= '1' && cc <= '9':
				tbuf.WriteByte(cc)
				st = 40
			case cc >= '0':
				tbuf.WriteByte(cc)
				st = 41
			}
		case 1: // ++
			if cc == '+' {
				rv = append(rv, ScanTokType{Tok: TokIncr, LineNo: line_no, TokName: TokIncr.String()})
			} else {
				rv = append(rv, ScanTokType{Tok: TokPlus, LineNo: line_no, TokName: TokPlus.String()})
				Backup1_GotoSt0()
			}
			st = 0
		case 2: // --
			if cc == '-' {
				rv = append(rv, ScanTokType{Tok: TokDecr, LineNo: line_no, TokName: TokDecr.String()})
			} else {
				rv = append(rv, ScanTokType{Tok: TokMinus, LineNo: line_no, TokName: TokMinus.String()})
				Backup1_GotoSt0()
			}
			st = 0
		case 30: // ID
			if cc >= 'a' && cc <= 'z' || cc >= 'A' && cc <= 'Z' || cc == '$' || cc == '_' {
				tbuf.WriteByte(cc)
			} else {
				saveId()
				Backup1_GotoSt0()
			}
		case 40: // Number
			// if cc == 'b' || cc == 'x' || cc == 'X' || cc == 'B' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
			if cc >= '0' && cc <= '9' {
				tbuf.WriteByte(cc)
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 41: // 0 Prefix - octal or other...
			if cc == 'b' || cc == 'B' {
				tbuf.WriteByte(cc)
				st = 42
			} else if cc == 'x' || cc == 'X' {
				tbuf.WriteByte(cc)
				st = 44
			} else if cc >= '0' && cc <= '7' {
				tbuf.WriteByte(cc)
				st = 43
			} else if cc >= '8' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in octal number.  Should be 0..7\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
			// if cc >= '0' && cc <= '9' || cc == 'b' || cc == 'x' || cc == 'X' || cc == 'B' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
		case 42: // Binary Number
			if cc >= '0' && cc <= '1' {
				tbuf.WriteByte(cc)
			} else if cc >= '2' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in binary number.  Should be 0 or 1\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 43: // Octal Number
			if cc >= '0' && cc <= '7' {
				tbuf.WriteByte(cc)
			} else if cc >= '8' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in octal number.  Should be 0..7\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 44: // Hex Number
			if cc >= '0' && cc <= '9' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
				tbuf.WriteByte(cc)
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		default: // error
			errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<-\n", line_no, col_no, string(cc)))
		}
	}
	if len(errList) > 0 {
		err = fmt.Errorf("%s", strings.Join(errList, "\n"))
	}
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	return
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code Generation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// func emit(lab string, op Mac.OpCodeType, hand HandType) {
func emit(lab string, op Mac.OpCodeType, hand string) {
	// xyzzy000 - TODO
}

var valTab = make(map[int]string)

func gen_AssignConstants(ast *ParseTree, kk *int) {
	if ast == nil {
		return
	}
	if ast.Op == PtNum {
		s, ok := valTab[ast.Value]
		if ok {
			ast.Name = s
		} else {
			ast.Name = fmt.Sprintf("c_%d", *kk)
			valTab[ast.Value] = ast.Name
			(*kk)++
		}
	}
	if ast.Left != nil {
		gen_AssignConstants(ast.Left, kk)
	}
	if ast.Right != nil {
		gen_AssignConstants(ast.Right, kk)
	}
}

func DumpTree(ast *ParseTree, lev int) (rv string) {
	rv = "--not implemented yet--"
	return
}

func gen_Inorder(ast *ParseTree, kk *int) {
	if ast.Left != nil {
	}
	if ast.Right != nil {
	}
	if ast.Op == PtAdd {
		if ast.Left.InAcc && !ast.Right.InAcc {
			emit("", Mac.OpAdd, ast.Right.Name) // Add X to ACC
			ast.InAcc = true                    // result in accumulator
		} else if !ast.Left.InAcc && ast.Right.InAcc {
			emit("", Mac.OpAdd, ast.Left.Name) // Add X to ACC - take advantage of commutative
			ast.InAcc = true                   // result in accumulator
		} else if !ast.Left.InAcc && !ast.Right.InAcc {
			emit("", Mac.OpLoad, ast.Left.Name) // load Left
			emit("", Mac.OpAdd, ast.Right.Name) // Add X to ACC
			ast.InAcc = true                    // result in accumulator
		} else {
			fmt.Printf("Error: bad tree at:%s : %s\n", godebug.LF(), DumpTree(ast, 0)) // xyzzy - dump tree
		}
	} else if ast.Op == PtSub {
	} else if ast.Op == PtMul {

		// PtLoad    = TokType(112) // ParseTree	-- Load from Memory
		// PtStore   = TokType(113) // ParseTree	-- Save to Memroy
		// PtInput   = TokType(101) // ParseTree  -- Perform input on symbol
		// PtOutput  = TokType(102) // ParseTree	-- Perform output on symbol
		// PtNum     = TokType(104) // ParseTree	-- Constant / Number
		// PtID      = TokType(105) // ParseTree	-- Identifier

	} else {
	}
}

func TypeCheck1_Incr_Decr(ast *ParseTree, errList *[]string) {
	if ast == nil {
		return
	}
	if ast.Left != nil {
		TypeCheck1_Incr_Decr(ast.Left, errList)
	}
	if ast.Right != nil {
		TypeCheck1_Incr_Decr(ast.Right, errList)
	}
	if ast.Op == PtIncr || ast.Op == PtDecr {
		if ast.Left.Op != PtID {
			*errList = append(*errList, "Type error - Must have an LValue (ID) for increment/decrement operations")
		}
	}
}

func ReWrite3_Incr_Decr(ast **ParseTree) {
	if *ast == nil {
		return
	}
	if (*ast).Left != nil {
		ReWrite3_Incr_Decr(&((*ast).Left))
	}
	if (*ast).Right != nil {
		ReWrite3_Incr_Decr(&((*ast).Right))
	}
	if (*ast).Op == PtIncr {
		(*ast).Op = PtAdd
		(*ast).OpName = "PtAdd"
		(*ast).InAcc = true
		st, _ := LookupConst(1, (*ast).LineNo)
		(*ast).Right = &ParseTree{
			Op:     PtNum,
			OpName: "PtNum",
			LineNo: (*ast).LineNo,
			Name:   "_1",
			Value:  1,
			St:     st,
		}
		// Store result also - so ++ is permanent (has side effect).
		TmpTree := *ast
		TmpName := (*ast).Left.St.Name
		TmpSt := (*ast).Left.St
		(*ast) = &ParseTree{
			Op:     PtStore,
			OpName: "PtStore",
			LineNo: (*ast).LineNo,
			Name:   TmpName,
			St:     TmpSt,
			Left:   TmpTree,
			InAcc:  true,
		}
	} else if (*ast).Op == PtDecr {
		// xyzzy - should have a Store also
		(*ast).Op = PtSub
		(*ast).OpName = "PtSub"
		(*ast).InAcc = true
		st, _ := LookupConst(1, (*ast).LineNo)
		(*ast).Right = &ParseTree{
			Op:     PtNum,
			OpName: "PtNum",
			LineNo: (*ast).LineNo,
			Name:   "_1",
			Value:  1,
			St:     st,
		}
		// Store result also - so ++ is permanent (has side effect).
		TmpTree := *ast
		TmpName := (*ast).Left.St.Name
		TmpSt := (*ast).Left.St
		(*ast) = &ParseTree{
			Op:     PtStore,
			OpName: "PtStore",
			LineNo: (*ast).LineNo,
			Name:   TmpName,
			St:     TmpSt,
			Left:   TmpTree,
			InAcc:  true,
		}
	}
}

func ReWrite1_Expr_op_Expr(ast *ParseTree) (rv *ParseTree) {
	if ast == nil {
		return nil
	}
	if ast.Left != nil {
		ast.Left = ReWrite1_Expr_op_Expr(ast.Left)
	}
	if ast.Right != nil {
		ast.Right = ReWrite1_Expr_op_Expr(ast.Right)
	}
	TmpName := AllocateTemp(ast.LineNo)
	st, _ := LookupSymbol(TmpName)
	if ast.Op == PtAdd && ast.Left.InAcc && ast.Right.InAcc {
		tmpTree := ast.Right
		ast.Right = &ParseTree{
			Op:     PtID,
			OpName: "PtID",
			LineNo: ast.LineNo,
			Name:   TmpName,
			St:     st,
			Left: &ParseTree{
				Op:     PtStore,
				OpName: "PtStore",
				LineNo: ast.LineNo,
				Name:   TmpName,
				St:     st,
				Left:   tmpTree,
			},
		}
	}
	return ast
}

func genCode(ast *ParseTree, ofp *os.File) (err error) {

	// Pass 1 - Assign constants names
	kk := 1

	ResetTemp()
	LookupConst(1, 0) // Create constants 1 and 0
	LookupConst(0, 0)

	gen_AssignConstants(ast, &kk)

	// Tree Re-write : 1
	// 		xyzzy - assign temporary variables _tmp1, etc. for Expr(op)Expr - Right gets saved in Temp.
	// 		Becomes (_tmp=(Right)) -> Expr(Left-in-Reg)(op)_tmp
	// 		Always save the "Right" tree to a Temp, Then OP Right.
	// Tree Re-write : 2 - remove Unary Minus -> 0 - expr
	// Tree Re-write : 3 - remove ++ and -- -> expr + 1, expr - 1
	var errList []string
	TypeCheck1_Incr_Decr(ast, &errList)
	if len(errList) > 0 {
		err = fmt.Errorf("Type Errors:\n%s\n", errList)
		return
	}
	ReWrite3_Incr_Decr(&ast)

	ast = ReWrite1_Expr_op_Expr(ast)

	k2 := 4
	gen_Inorder(ast, &k2)

	GenSymbols(ofp)
	return
}

//ToBe! func GenerateCode(ast *SyntaxTree, out string) (err error) {
func GenerateCode(ast *ParseTree, out string) (err error) {
	ofp, e0 := filelib.Fopen(out, "w")
	if e0 != nil {
		err = fmt.Errorf("Unable to open output file [%s] error %s\n", out, e0)
		return
	}
	err = genCode(ast, ofp)
	ofp.Close()
	return
}

var dbScanner01 = false
