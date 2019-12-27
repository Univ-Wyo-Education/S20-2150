package main

import (
	"fmt"
	"os"

	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
)

// ------------------------------------------------------------------------------------------------------------------
// Tree Ops
// ------------------------------------------------------------------------------------------------------------------
func NewAst(op TokType, l, r *SyntaxTree, lno int) *SyntaxTree {
	return &SyntaxTree{Op: op, OpName: op.String(), Left: l, Right: r, LineNo: lno}
}

func NewAstID(SM string, lno int) *SyntaxTree {
	return &SyntaxTree{Op: TokID, OpName: TokID.String(), LineNo: lno, SValue: SM}
}

func NewAstNUM(SM string, vv int, lno int) *SyntaxTree {
	return &SyntaxTree{Op: TokNUM, OpName: TokNUM.String(), LineNo: lno, SValue: SM, IValue: vv}
}

func ValidateLValue(xx *SyntaxTree) {
	if db12 {
		fmt.Printf("%sTree to validate for LValue: %s at:%s%s\n", MiscLib.ColorCyan, godebug.SVarI(xx), godebug.LF(), MiscLib.ColorReset)
	}
	if xx.St == nil {
		// NParseError++
		fmt.Fprintf(os.Stderr, "Reference to %s requries an LValue (must be a declared variable). Line:%d\n", xx.SValue, xx.LineNo)
	}
}

var db12 = false
