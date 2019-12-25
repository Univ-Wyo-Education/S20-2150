package main

//
//import (
//	"fmt"
//	"strings"
//
//	"github.com/pschlump/MiscLib"
//	"github.com/pschlump/godebug"
//)
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Parser
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
///*
//stmt ::= ID '=' expr ';'
//	| 'in' ID ';'
//	| 'put' ID ';'
//	;
//*/
//
///*
//expr ::= '(' expr ')'
//	| lit '+' expr
//	| lit '-' expr
//	| lit '*' expr
//	| '-' expr
//	| lit '++'
//	| lit '--'
//	| lit
//	;
//
//*/
//
///*
//lit ::= Number
//	| ID
//	;
//*/
//
//func advance(pd *ParseData, n int) {
//	pd.curPos += n
//}
//
//func p_stmt(pd *ParseData) (pt *ParseTree) {
//	fmt.Printf("%sp_stmt pd.curPos=%d AT:%s%s\n", MiscLib.ColorYellow, pd.curPos, godebug.LF(), MiscLib.ColorReset)
//
//	if pd.curPos >= len(pd.tokens) {
//		return
//	}
//
//	ct := pd.tokens[pd.curPos+0].Tok
//	ct1 := pd.tokens[pd.curPos+1].Tok // File ends with 4 EOF's - so can always look forward
//	ct2 := pd.tokens[pd.curPos+2].Tok // File ends with 4 EOF's - so can always look forward
//
//	if ct == TokID && ct1 == TokEq {
//		nn := pd.tokens[pd.curPos+0].Name
//		ln := pd.tokens[pd.curPos+0].LineNo
//		st, err := LookupSymbol(nn)
//		if err != nil {
//			fmt.Printf("%sAT:%s add symbol [%s ]%s\n", MiscLib.ColorYellow, godebug.LF(), nn, MiscLib.ColorReset)
//			st, _ = AddSymbol(nn, ln)
//		}
//		id := &ParseTree{
//			Op:     PtID,
//			OpName: "PtID",
//			LineNo: pd.LineNo,
//			Name:   nn,
//			St:     st,
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		advance(pd, 2)
//		rv := p_expr(pd)
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		pt = &ParseTree{
//			Op:     PtStore,
//			OpName: "PtStore",
//			Left:   id,
//			Right:  rv,
//			LineNo: pd.LineNo,
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		ct = TokEOF
//		if pd.curPos < len(pd.tokens) {
//			ct = pd.tokens[pd.curPos+0].Tok
//		}
//		if ct == TokEOF {
//			return
//		} else if ct == TokSem {
//			fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//			advance(pd, 1)
//		} else {
//			fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//			pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Expected ';' found '%c': Line%d\n", pd.LineNo, ct))
//		}
//	} else if ct == TokInput && ct1 == TokID && ct2 == TokSem {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		Name := pd.tokens[pd.curPos+1].Name
//		st, err := LookupSymbol(Name)
//		if err != nil {
//			pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Symbol [%s] not defined: Line%d\n", Name, pd.LineNo))
//			st = SymbolTableType{Name: "Unknown"}
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		pt = &ParseTree{
//			Op:     PtInput,
//			OpName: "PtInput",
//			Name:   Name,
//			St:     st,
//			LineNo: pd.LineNo,
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		advance(pd, 3)
//	} else if ct == TokOutput && ct1 == TokID && ct2 == TokSem {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		Name := pd.tokens[pd.curPos+1].Name
//		st, err := LookupSymbol(Name)
//		if err != nil {
//			pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Symbol [%s] not defined: Line%d\n", Name, pd.LineNo))
//			st = SymbolTableType{Name: "Unknown"}
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		pt = &ParseTree{
//			Op:     PtOutput,
//			OpName: "PtOutput",
//			Name:   pd.tokens[pd.curPos+1].Name,
//			St:     st,
//			LineNo: pd.LineNo,
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		advance(pd, 3)
//	} else if ct == TokEOF {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		pt = nil
//	} else {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorYellow, godebug.LF(), MiscLib.ColorReset)
//		pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Invalid statement: Line%d\n", pd.LineNo))
//		pt = nil // xyzzy402 TODO - maybee need to return a dummy/error node.
//	}
//	return
//}
//
///*
//expr ::= '(' expr ')'
//	| lit '+' expr
//	| lit '-' expr
//	| lit '*' expr
//	| '-' expr
//	| lit '++'
//	| lit '--'
//	| lit
//	;
//*/
//func p_expr(pd *ParseData) (pt *ParseTree) {
//	fmt.Printf("%sp_expr pd.curPos=%d AT:%s%s\n", MiscLib.ColorGreen, pd.curPos, godebug.LF(), MiscLib.ColorReset)
//
//	if pd.curPos >= len(pd.tokens) {
//		return
//	}
//
//	ct := pd.tokens[pd.curPos+0].Tok
//	if ct == TokLP {
//		advance(pd, 1)
//		pt = p_expr(pd)
//		if pd.curPos >= len(pd.tokens) {
//			return
//		}
//		ct2 := pd.tokens[pd.curPos+0].Tok
//		if ct2 == TokRP {
//			advance(pd, 1)
//		} else {
//			// missing RP syntax errror
//			pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Missing close parenthesis, ')' : Line%d\n", pd.LineNo))
//		}
//		return
//	} else if ct == TokMinus { // Unary Minus
//		advance(pd, 1)
//		rv := p_expr(pd)
//		Zero := &ParseTree{ // Create a 0 value
//			Op:     PtNum,
//			OpName: "PtNum",
//			Value:  0,
//		}
//		pt = &ParseTree{
//			Op:     PtSub,             // Implement unary minus as 0 - Expr
//			OpName: "PtSub/PtU_Minus", // Implement unary minus as 0 - Expr
//			Left:   Zero,
//			Right:  rv,
//			LineNo: pd.LineNo,
//		}
//		return
//	} else {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//		pt = p_lit(pd)
//		if pd.curPos >= len(pd.tokens) {
//			return
//		}
//		ct2 := pd.tokens[pd.curPos+0].Tok
//		if ct2 != TokRP && ct2 != TokSem && pd.curPos < len(pd.tokens) {
//
//			ct2 = pd.tokens[pd.curPos+0].Tok
//			for ct2 != TokRP && ct2 != TokSem && pd.curPos < len(pd.tokens) {
//
//				fmt.Printf("%sAT:%s ct2=%s%s *********** Loop Top ********** \n", MiscLib.ColorGreen, godebug.LF(), ct2, MiscLib.ColorReset)
//				if ct2 == TokPlus {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					advance(pd, 1)
//					pt2 := p_expr(pd)
//					pt = &ParseTree{
//						Op:     PtAdd,
//						OpName: "PtAdd",
//						Left:   pt,
//						Right:  pt2,
//						LineNo: pd.LineNo,
//					}
//					// xyzzy - if next token is TokPlus - then loop?
//				} else if ct2 == TokMinus {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					advance(pd, 1)
//					pt2 := p_expr(pd)
//					pt = &ParseTree{
//						Op:     PtSub,
//						OpName: "PtSub",
//						Left:   pt,
//						Right:  pt2,
//						LineNo: pd.LineNo,
//					}
//				} else if ct2 == TokMul {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					advance(pd, 1)
//					pt2 := p_expr(pd)
//					pt = &ParseTree{
//						Op:     PtMul,
//						OpName: "PtMul",
//						Left:   pt,
//						Right:  pt2,
//						LineNo: pd.LineNo,
//					}
//				} else if ct2 == TokIncr {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					advance(pd, 1)
//					pt = &ParseTree{
//						Op:     PtIncr,
//						OpName: "PtIncr",
//						Left:   pt,
//						LineNo: pd.LineNo,
//					}
//				} else if ct2 == TokDecr {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					advance(pd, 1)
//					pt = &ParseTree{
//						Op:     PtDecr,
//						OpName: "PtDecr",
//						Left:   pt,
//						LineNo: pd.LineNo,
//					}
//				} else if ct2 == TokSem {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					break
//				} else if ct2 == TokEOF {
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					break
//				} else if ct2 == TokLP {
//					advance(pd, 1)
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					break
//				} else {
//					advance(pd, 1)
//					fmt.Printf("%sAT:%s%s\n", MiscLib.ColorGreen, godebug.LF(), MiscLib.ColorReset)
//					pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Invalid expression, expected Expr [op] Expr: Line%d\n", pd.LineNo))
//					pt = &ParseTree{
//						Op:     PtError,
//						OpName: "PtError",
//						LineNo: pd.LineNo,
//						Source: godebug.LF(),
//					}
//					break
//				}
//
//			}
//		}
//	}
//	return
//}
//
///*
//lit ::= Number
//	| ID
//	;
//*/
//func p_lit(pd *ParseData) (pt *ParseTree) {
//	fmt.Printf("%sp_lit pd.curPos=%d AT:%s%s\n", MiscLib.ColorCyan, pd.curPos, godebug.LF(), MiscLib.ColorReset)
//
//	if pd.curPos >= len(pd.tokens) {
//		return
//	}
//
//	ct := pd.tokens[pd.curPos+0].Tok
//	vv := pd.tokens[pd.curPos+0].Value
//	nn := pd.tokens[pd.curPos+0].Name
//	if ct == TokNum {
//		advance(pd, 1)
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorCyan, godebug.LF(), MiscLib.ColorReset)
//		pt = &ParseTree{
//			Op:     PtNum,
//			OpName: "PtNum",
//			LineNo: pd.LineNo,
//			Value:  vv,
//		}
//	} else if ct == TokID {
//		advance(pd, 1)
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorCyan, godebug.LF(), MiscLib.ColorReset)
//		st, err := LookupSymbol(nn)
//		if err != nil {
//			fmt.Printf("AT:%s\n", godebug.LF())
//			pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Symbol [%s] not defined: Line%d\n", nn, pd.LineNo))
//			st = SymbolTableType{Name: "Unknown"}
//		}
//		pt = &ParseTree{
//			Op:     PtID,
//			OpName: "PtID",
//			LineNo: pd.LineNo,
//			Name:   nn,
//			St:     st,
//		}
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorCyan, godebug.LF(), MiscLib.ColorReset)
//	} else {
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorCyan, godebug.LF(), MiscLib.ColorReset)
//		advance(pd, 1)
//		fmt.Printf("%sAT:%s%s\n", MiscLib.ColorCyan, godebug.LF(), MiscLib.ColorReset)
//		pd.errList = append(pd.errList, fmt.Sprintf("Syntax Error: Invalid expression: Line%d\n", pd.LineNo))
//		pt = &ParseTree{
//			Op:     PtError,
//			OpName: "PtError",
//			LineNo: pd.LineNo,
//			Source: godebug.LF(),
//		}
//	}
//	return
//}
//
//func ParseInput(pd *ParseData) (pt *ParseTree, err error) {
//	// recursive decent - returns parse tree.
//	pt = p_stmt(pd)
//	if len(pd.errList) > 0 {
//		err = fmt.Errorf("%s", strings.Join(pd.errList, "\n"))
//	}
//	return
//}
