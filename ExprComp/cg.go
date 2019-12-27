package main

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code Generation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

import (
	"fmt"
	"os"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
)

// ...
// 1. collect a list of constants in 'list' with values.
// 2. create a "name" assignment for each constant - _<value> - modify tree.
func cgPass1_gen_const(ast *SyntaxTree, list *map[string]int) {
	if ast == nil {
		return
	}
	cgPass1_gen_const(ast.Left, list)
	cgPass1_gen_const(ast.Right, list)
	if ast.Op == TokNUM {
		var key string
		if ast.IValue >= 0 {
			key = fmt.Sprintf("_%d", ast.IValue)
		} else {
			key = fmt.Sprintf("__%d", -ast.IValue)
		}
		(*list)[key] = ast.IValue
		ast.Op = OpNUM
	} else if ast.Op == TokIncr {
		key := fmt.Sprintf("_%d", 1)
		(*list)[key] = 1
	} else if ast.Op == TokDecr {
		key := fmt.Sprintf("__%d", 1)
		(*list)[key] = -1
	}
}

// ...
// Collect list of all fo the variables
func cgPass2_vars(ast *SyntaxTree, list *map[string]bool) {
	if ast == nil {
		return
	}
	cgPass2_vars(ast.Left, list)
	cgPass2_vars(ast.Right, list)
	if ast.Op == TokID {
		key := ast.SValue
		(*list)[key] = true
		ast.Op = OpID
	} else if ast.Op == TokMul || ast.Op == TokDiv {
		(*list)["_a"] = true
		(*list)["_b"] = true
	}
}

// ...
// Assign temporary storage for operators in expressions
func cgPass3_assign_tmp(ast *SyntaxTree, list *map[string]bool, tn *int) {
	if ast == nil {
		return
	}
	cgPass3_assign_tmp(ast.Left, list, tn)
	cgPass3_assign_tmp(ast.Right, list, tn)
	if (ast.Op == TokPlus || ast.Op == TokMinus || ast.Op == TokMul || ast.Op == TokDiv) && ast.Left != nil && ast.Right != nil {
		ast.SValue = fmt.Sprintf("_t_%d", *tn)
		(*tn)++
	}
}

func cgPass4_gen_code(pos int, ast *SyntaxTree, depth int, errList []string) (err error) {
	if ast == nil {
		return
	}
	cgPass4_gen_code(pos, ast.Left, depth+1, errList)
	cgPass4_gen_code(pos, ast.Right, depth+1, errList)

	if (ast.Op == TokPlus || ast.Op == TokMinus || ast.Op == TokMul || ast.Op == TokDiv) && ast.Left != nil && ast.Right != nil {
		// Add/Sub/Mul/Div Left to Right - store in _t_%d tmp.  So at end of OP the value is in a variable in memory and in accumulator AC.
		// For '=' this means just store the AC, for nested expressions it means you are always working on a variable.
		emit("", Mac.OpLoad, ast.Left.SValue)
		if ast.Op == TokPlus {
			emit("", Mac.OpAdd, ast.Right.SValue)
		}
		if ast.Op == TokMinus {
			emit("", Mac.OpSubt, ast.Right.SValue)
		}
		if ast.Op == TokMul {
			emit("", Mac.OpStore, "_a")
			emit("", Mac.OpLoad, ast.Right.SValue)
			emit("", Mac.OpStore, "_b")
			emit("", Mac.OpJnS, "__mul__") // result left in AC
		}
		if ast.Op == TokDiv {
			emit("", Mac.OpStore, "_a")
			emit("", Mac.OpLoad, ast.Right.SValue)
			emit("", Mac.OpStore, "_b")
			emit("", Mac.OpJnS, "__div__") // result left in AC
		}
		emit("", Mac.OpStore, ast.SValue)

	} else if ast.Op == OpAssign && ast.Left != nil && ast.Right != nil {
		// Assignment
		emit("", Mac.OpLoad, ast.Right.SValue)
		emit("", Mac.OpStore, ast.Left.SValue)

	} else if ast.Op == OpInput && ast.Left != nil && ast.Right == nil {
		// Input to Variable
		emit("", Mac.OpInput, "")
		emit("", Mac.OpStore, ast.Left.SValue)

	} else if ast.Op == OpOutput && ast.Left != nil && ast.Right == nil {
		// Output to Variable
		emit("", Mac.OpLoad, ast.Left.SValue)
		emit("", Mac.OpOutput, "")

	} else if (ast.Op == TokIncr || ast.Op == TokDecr) && ast.Left != nil && ast.Left.Op == OpID {
		// Increment and Decrement alwasy work on IDs.  Result is in Variable and AC
		emit("", Mac.OpLoad, ast.Left.SValue)
		if ast.Op == TokIncr {
			emit("", Mac.OpAdd, "_1")
		} else {
			emit("", Mac.OpAdd, "__1")
		}
		emit("", Mac.OpStore, ast.Left.SValue)
		ast.SValue = ast.Left.SValue // <<<<<<<<<<<<<<< Note - now ID has moved up tree (Useful in + - / *

	} else {
		fmt.Fprintf(os.Stderr, "%sError: Missing Case in Code Generation: %s, at:%s %s\n", MiscLib.ColorRed, godebug.SVarI(ast), godebug.LF(), MiscLib.ColorReset)
		errList = append(errList, fmt.Sprintf("Error: Missing Case in Code Generation: %s", godebug.SVarI(ast)))
		err = fmt.Errorf("Errors in code generation")
	}
	return
}

func GenerateCode(astList []*SyntaxTree, out string) (err error) {
	ConstList := make(map[string]int)
	VarList := make(map[string]bool)
	TmpList := make(map[string]bool)
	errList := make([]string, 0, 4)

	// -------------------------------------------------------------------------
	// Pass 1 & 2 - get variables, create constants as variables
	// -------------------------------------------------------------------------
	for _, ast := range astList {
		cgPass1_gen_const(ast, &ConstList)
		cgPass2_vars(ast, &VarList)
	}

	// -------------------------------------------------------------------------
	// Pass 3 - genrate temporarys
	// -------------------------------------------------------------------------
	tn := 1
	for _, ast := range astList {
		cgPass3_assign_tmp(ast, &TmpList, &tn)
		tn = 1
	}

	// -------------------------------------------------------------------------
	// Pass 4 - walk tree and generate case by case
	// -------------------------------------------------------------------------
	for ii, ast := range astList {
		cgPass4_gen_code(ii, ast, 0, errList)
	}

	emit("", Mac.OpHalt, "")

	for nam, val := range ConstList {
		emit(nam, Mac.DirDEC, fmt.Sprintf("%d", val))
	}
	for nam := range VarList {
		emit(nam, Mac.DirDEC, "0")
	}
	for nam := range TmpList {
		emit(nam, Mac.DirDEC, "0")
	}

	return
}

// func emit(lab string, op Mac.OpCodeType, hand HandType) {
func emit(lab string, op Mac.OpCodeType, hand string) {
	// xyzzy000 - TODO
}
