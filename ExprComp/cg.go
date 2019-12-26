package main

import (
	"github.com/Univ-Wyo-Education/S20-2150/Mac"
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code Generation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// func emit(lab string, op Mac.OpCodeType, hand HandType) {
func emit(lab string, op Mac.OpCodeType, hand string) {
	// xyzzy000 - TODO
}

//var valTab = make(map[int]string)
//
//func gen_AssignConstants(ast *ParseTree, kk *int) {
//	if ast == nil {
//		return
//	}
//	if ast.Op == PtNUM {
//		s, ok := valTab[ast.Value]
//		if ok {
//			ast.Name = s
//		} else {
//			ast.Name = fmt.Sprintf("c_%d", *kk)
//			valTab[ast.Value] = ast.Name
//			(*kk)++
//		}
//	}
//	if ast.Left != nil {
//		gen_AssignConstants(ast.Left, kk)
//	}
//	if ast.Right != nil {
//		gen_AssignConstants(ast.Right, kk)
//	}
//}
//
//func DumpTree(ast *ParseTree, lev int) (rv string) {
//	rv = "--not implemented yet--"
//	return
//}
//
//func gen_Inorder(ast *ParseTree, kk *int) {
//	if ast.Left != nil {
//	}
//	if ast.Right != nil {
//	}
//	if ast.Op == PtAdd {
//		if ast.Left.InAcc && !ast.Right.InAcc {
//			emit("", Mac.OpAdd, ast.Right.Name) // Add X to ACC
//			ast.InAcc = true                    // result in accumulator
//		} else if !ast.Left.InAcc && ast.Right.InAcc {
//			emit("", Mac.OpAdd, ast.Left.Name) // Add X to ACC - take advantage of commutative
//			ast.InAcc = true                   // result in accumulator
//		} else if !ast.Left.InAcc && !ast.Right.InAcc {
//			emit("", Mac.OpLoad, ast.Left.Name) // load Left
//			emit("", Mac.OpAdd, ast.Right.Name) // Add X to ACC
//			ast.InAcc = true                    // result in accumulator
//		} else {
//			fmt.Printf("Error: bad tree at:%s : %s\n", godebug.LF(), DumpTree(ast, 0)) // xyzzy - dump tree
//		}
//	} else if ast.Op == PtSub {
//	} else if ast.Op == PtMul {
//
//		// PtLoad    = TokType(112) // ParseTree	-- Load from Memory
//		// PtStore   = TokType(113) // ParseTree	-- Save to Memroy
//		// PtInput   = TokType(101) // ParseTree  -- Perform input on symbol
//		// PtOutput  = TokType(102) // ParseTree	-- Perform output on symbol
//		// PtNUM     = TokType(104) // ParseTree	-- Constant / Number
//		// PtID      = TokType(105) // ParseTree	-- Identifier
//
//	} else {
//	}
//}
//
//func TypeCheck1_Incr_Decr(ast *ParseTree, errList *[]string) {
//	if ast == nil {
//		return
//	}
//	if ast.Left != nil {
//		TypeCheck1_Incr_Decr(ast.Left, errList)
//	}
//	if ast.Right != nil {
//		TypeCheck1_Incr_Decr(ast.Right, errList)
//	}
//	if ast.Op == PtIncr || ast.Op == PtDecr {
//		if ast.Left.Op != PtID {
//			*errList = append(*errList, "Type error - Must have an LValue (ID) for increment/decrement operations")
//		}
//	}
//}
//
//func ReWrite3_Incr_Decr(ast **ParseTree) {
//	if *ast == nil {
//		return
//	}
//	if (*ast).Left != nil {
//		ReWrite3_Incr_Decr(&((*ast).Left))
//	}
//	if (*ast).Right != nil {
//		ReWrite3_Incr_Decr(&((*ast).Right))
//	}
//	if (*ast).Op == PtIncr {
//		(*ast).Op = PtAdd
//		(*ast).OpName = "PtAdd"
//		(*ast).InAcc = true
//		st, _ := LookupConst(1, (*ast).LineNo)
//		(*ast).Right = &ParseTree{
//			Op:     PtNUM,
//			OpName: "PtNUM",
//			LineNo: (*ast).LineNo,
//			Name:   "_1",
//			Value:  1,
//			St:     st,
//		}
//		// Store result also - so ++ is permanent (has side effect).
//		TmpTree := *ast
//		TmpName := (*ast).Left.St.Name
//		TmpSt := (*ast).Left.St
//		(*ast) = &ParseTree{
//			Op:     PtStore,
//			OpName: "PtStore",
//			LineNo: (*ast).LineNo,
//			Name:   TmpName,
//			St:     TmpSt,
//			Left:   TmpTree,
//			InAcc:  true,
//		}
//	} else if (*ast).Op == PtDecr {
//		// xyzzy - should have a Store also
//		(*ast).Op = PtSub
//		(*ast).OpName = "PtSub"
//		(*ast).InAcc = true
//		st, _ := LookupConst(1, (*ast).LineNo)
//		(*ast).Right = &ParseTree{
//			Op:     PtNUM,
//			OpName: "PtNUM",
//			LineNo: (*ast).LineNo,
//			Name:   "_1",
//			Value:  1,
//			St:     st,
//		}
//		// Store result also - so ++ is permanent (has side effect).
//		TmpTree := *ast
//		TmpName := (*ast).Left.St.Name
//		TmpSt := (*ast).Left.St
//		(*ast) = &ParseTree{
//			Op:     PtStore,
//			OpName: "PtStore",
//			LineNo: (*ast).LineNo,
//			Name:   TmpName,
//			St:     TmpSt,
//			Left:   TmpTree,
//			InAcc:  true,
//		}
//	}
//}
//
//func ReWrite1_Expr_op_Expr(ast *ParseTree) (rv *ParseTree) {
//	if ast == nil {
//		return nil
//	}
//	if ast.Left != nil {
//		ast.Left = ReWrite1_Expr_op_Expr(ast.Left)
//	}
//	if ast.Right != nil {
//		ast.Right = ReWrite1_Expr_op_Expr(ast.Right)
//	}
//	TmpName := AllocateTemp(ast.LineNo)
//	st, _ := LookupSymbol(TmpName)
//	if ast.Op == PtAdd && ast.Left.InAcc && ast.Right.InAcc {
//		tmpTree := ast.Right
//		ast.Right = &ParseTree{
//			Op:     PtID,
//			OpName: "PtID",
//			LineNo: ast.LineNo,
//			Name:   TmpName,
//			St:     st,
//			Left: &ParseTree{
//				Op:     PtStore,
//				OpName: "PtStore",
//				LineNo: ast.LineNo,
//				Name:   TmpName,
//				St:     st,
//				Left:   tmpTree,
//			},
//		}
//	}
//	return ast
//}
//
//func genCode(ast *ParseTree, ofp *os.File) (err error) {
//
//	// Pass 1 - Assign constants names
//	kk := 1
//
//	ResetTemp()
//	LookupConst(1, 0) // Create constants 1 and 0
//	LookupConst(0, 0)
//
//	gen_AssignConstants(ast, &kk)
//
//	// Tree Re-write : 1
//	// 		xyzzy - assign temporary variables _tmp1, etc. for Expr(op)Expr - Right gets saved in Temp.
//	// 		Becomes (_tmp=(Right)) -> Expr(Left-in-Reg)(op)_tmp
//	// 		Always save the "Right" tree to a Temp, Then OP Right.
//	// Tree Re-write : 2 - remove Unary Minus -> 0 - expr
//	// Tree Re-write : 3 - remove ++ and -- -> expr + 1, expr - 1
//	var errList []string
//	TypeCheck1_Incr_Decr(ast, &errList)
//	if len(errList) > 0 {
//		err = fmt.Errorf("Type Errors:\n%s\n", errList)
//		return
//	}
//	ReWrite3_Incr_Decr(&ast)
//
//	ast = ReWrite1_Expr_op_Expr(ast)
//
//	k2 := 4
//	gen_Inorder(ast, &k2)
//
//	GenSymbols(ofp)
//	return
//}
//
////ToBe! func GenerateCode(ast *SyntaxTree, out string) (err error) {
//func GenerateCode(ast *ParseTree, out string) (err error) {
//	ofp, e0 := filelib.Fopen(out, "w")
//	if e0 != nil {
//		err = fmt.Errorf("Unable to open output file [%s] error %s\n", out, e0)
//		return
//	}
//	err = genCode(ast, ofp)
//	ofp.Close()
//	return
//}

func GenerateCode(ast *SyntaxTree, out string) (err error) {
	return
}
