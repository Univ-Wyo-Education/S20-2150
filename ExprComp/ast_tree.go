package main

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
}
