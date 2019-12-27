package main

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code Generation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

import (
	"fmt"
	"os"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
	"github.com/pschlump/MiscLib"
	"github.com/pschlump/filelib"
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
		ast.OpName = OpID.String()
		ast.SValue = key
	} else if ast.Op == TokIncr || ast.Op == OpIncr {
		key := fmt.Sprintf("_%d", 1)
		(*list)[key] = 1
	} else if ast.Op == TokDecr || ast.Op == OpDecr {
		key := fmt.Sprintf("__%d", 1)
		(*list)[key] = -1
	} else if ast.Op == OpUMinus && ast.Left != nil {
		key := fmt.Sprintf("_%d", 0)
		(*list)[key] = 0
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
		ast.OpName = OpID.String()
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
	if (ast.Op == OpAdd || ast.Op == OpSub || ast.Op == OpMul || ast.Op == OpDiv) && ast.Left != nil && ast.Right != nil {
		ast.SValue = fmt.Sprintf("_t_%d", *tn)
		(*tn)++
	} else if ast.Op == OpUMinus && ast.Left != nil {
		ast.SValue = fmt.Sprintf("_t_%d", *tn)
		(*tn)++
	}
}

func cgPass4_gen_code(pos int, ast *SyntaxTree, depth int, errList []string, subUsed map[string]bool, outFp *os.File) (err error) {
	if ast == nil {
		return
	}
	if ast.Op == PtError {
		return
	}
	err = cgPass4_gen_code(pos, ast.Left, depth+1, errList, subUsed, outFp)
	if err != nil {
		return
	}
	err = cgPass4_gen_code(pos, ast.Right, depth+1, errList, subUsed, outFp)
	if err != nil {
		return
	}

	if (ast.Op == OpAdd || ast.Op == OpSub || ast.Op == OpMul || ast.Op == OpDiv) && ast.Left != nil && ast.Right != nil {
		// Add/Sub/Mul/Div Left to Right - store in _t_%d tmp.  So at end of OP the value is in a variable in memory and in accumulator AC.
		// For '=' this means just store the AC, for nested expressions it means you are always working on a variable.
		emit("", Mac.OpLoad, ast.Left.SValue, outFp)
		if ast.Op == OpAdd {
			emit("", Mac.OpAdd, ast.Right.SValue, outFp)
		}
		if ast.Op == OpSub {
			emit("", Mac.OpSubt, ast.Right.SValue, outFp)
		}
		if ast.Op == OpMul {
			emit("", Mac.OpStore, "_a", outFp)
			emit("", Mac.OpLoad, ast.Right.SValue, outFp)
			emit("", Mac.OpStore, "_b", outFp)
			emit("", Mac.OpJnS, "__mul__", outFp) // result left in AC
			subUsed["__mul__"] = true
		}
		if ast.Op == OpDiv {
			emit("", Mac.OpStore, "_a", outFp)
			emit("", Mac.OpLoad, ast.Right.SValue, outFp)
			emit("", Mac.OpStore, "_b", outFp)
			emit("", Mac.OpJnS, "__div__", outFp) // result left in AC
			subUsed["__div__"] = true
		}
		emit("", Mac.OpStore, ast.SValue, outFp)

	} else if ast.Op == OpUMinus && ast.Left != nil && ast.Right == nil {
		// Unary Minus ( -a ) => ( 0 - a )
		emit("", Mac.OpLoad, "_0", outFp)
		emit("", Mac.OpSubt, ast.Left.SValue, outFp)
		emit("", Mac.OpStore, ast.SValue, outFp)

	} else if ast.Op == OpAssign && ast.Left != nil && ast.Right != nil {
		// Assignment
		emit("", Mac.OpLoad, ast.Right.SValue, outFp)
		emit("", Mac.OpStore, ast.Left.SValue, outFp)

	} else if ast.Op == OpInput && ast.Left != nil && ast.Right == nil {
		// Input to Variable
		emit("", Mac.OpInput, "", outFp)
		emit("", Mac.OpStore, ast.Left.SValue, outFp)

	} else if ast.Op == OpOutput && ast.Left != nil && ast.Right == nil {
		// Output to Variable
		emit("", Mac.OpLoad, ast.Left.SValue, outFp)
		emit("", Mac.OpOutput, "", outFp)

	} else if (ast.Op == OpIncr || ast.Op == OpDecr) && ast.Left != nil && ast.Left.Op == OpID {
		// Increment and Decrement alwasy work on IDs.  Result is in Variable and AC
		emit("", Mac.OpLoad, ast.Left.SValue, outFp)
		if ast.Op == TokIncr || ast.Op == OpIncr {
			emit("", Mac.OpAdd, "_1", outFp)
		} else {
			emit("", Mac.OpAdd, "__1", outFp)
		}
		emit("", Mac.OpStore, ast.Left.SValue, outFp)
		ast.SValue = ast.Left.SValue // <<<<<<<<<<<<<<< Note - now ID has moved up tree (Useful in + - / *
		// ast.St = ast.Left.St         // if not null, then LValue

	} else if ast.Op == OpID && ast.Left == nil && ast.Right == nil {
	} else if ast.Op == OpNUM && ast.Left == nil && ast.Right == nil {
	} else {
		fmt.Fprintf(os.Stderr, "%sError: Missing Case in Code Generation: %s, line: %d depth: %d at:%s %s\n", MiscLib.ColorRed, godebug.SVarI(ast), ast.LineNo, depth, godebug.LF(), MiscLib.ColorReset)
		errList = append(errList, fmt.Sprintf("Error: Missing Case in Code Generation: %s", godebug.SVarI(ast)))
		err = fmt.Errorf("Errors in code generation")
	}
	return
}

func GenerateCode(astList []*SyntaxTree, out string) (err error) {
	ConstList := make(map[string]int)
	VarList := make(map[string]bool)
	TmpList := make(map[string]bool)
	SubList := make(map[string]bool)
	errList := make([]string, 0, 4)

	outFp, err := filelib.Fopen(out, "w")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Fatal: Unable to open output [%s] error: %s\n", out, err)
		os.Exit(1)
	}
	defer outFp.Close()

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
		err = cgPass4_gen_code(ii, ast, 0, errList, SubList, outFp)
	}

	emit("", Mac.OpHalt, "", outFp)

	for _, sub := range SortKeysMapStringBool(SubList) {
		emitSub(sub, outFp)
	}

	for _, nam := range SortKeysMapStringInt(ConstList) {
		val := ConstList[nam]
		emit(nam, Mac.DirDEC, fmt.Sprintf("%d", val), outFp)
	}
	for _, nam := range SortKeysMapStringBool(VarList) {
		emit(nam, Mac.DirDEC, "0", outFp)
	}
	for _, nam := range SortKeysMapStringBool(TmpList) {
		emit(nam, Mac.DirDEC, "0", outFp)
	}

	// xyzzy - Error Check - len(errList) > 0

	return
}

func emitSub(sub string, outFp *os.File) {
	fmt.Fprintf(outFp, "$include$ %s\n", sub)
}

// func emit(lab string, op Mac.OpCodeType, hand HandType) {
func emit(lab string, op Mac.OpCodeType, hand string, outFp *os.File) {
	if lab != "" {
		fmt.Fprintf(outFp, "%s,\t%s %s\n", lab, op, hand)
	} else {
		fmt.Fprintf(outFp, "\t%s %s\n", op, hand)
	}
}
