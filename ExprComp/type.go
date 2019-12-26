package main

const (
	// Scanner Tokens
	TokID     = TokType(ID)   // [a-zA-Z][a-zA-Z0-9_$]*
	TokEq     = TokType('=')  // =
	TokInput  = TokType('I')  // 'in'
	TokOutput = TokType('P')  // 'put'
	TokLP     = TokType('(')  // '('
	TokRP     = TokType(')')  // ')'
	TokPlus   = TokType('+')  // '+'
	TokMinus  = TokType('-')  // '-'
	TokMul    = TokType('*')  // '*'
	TokIncr   = TokType(INCR) // '++'
	TokDecr   = TokType(DECR) // '--'
	TokNUM    = TokType(NUM)  // Number / Constant
	TokSem    = TokType(';')  // ';'
	TokEOF    = TokType(0)    // Magic EOF token

	// Tokens used in the parser and parse trees.
	PtExpr  = TokType(300) // ParseTree	-- Expression - Left is child
	PtNUM   = TokType(304) // ParseTree	-- Constant / Number
	PtID    = TokType(305) // ParseTree	-- Identifier
	PtAdd   = TokType(307) // ParseTree	-- Binary '+'
	PtSub   = TokType(308) // ParseTree	-- Binary '-'
	PtMul   = TokType(309) // ParseTree	-- Binary '*'
	PtIncr  = TokType(310) // ParseTree	-- Postfix Unary '++'
	PtDecr  = TokType(311) // ParseTree	-- Postfix Unary '--'
	PtLoad  = TokType(312) // ParseTree	-- Load from Memory
	PtStore = TokType(313) // ParseTree	-- Save to Memroy

	PtError  = TokType(306) // ParseTree	-- Error in tree node.
	PtInput  = TokType(GET) // ParseTree   -- Perform input on symbol
	PtOutput = TokType(PUT) // ParseTree	-- Perform output on symbol
	OpUMinus = TokType(401) // SyntaxTree -- Replacement for ParseTree -- Unary Minus
	OpAdd    = TokType(402) // SyntaxTree -- Replacement for ParseTree -- Binary '+'
	OpSub    = TokType(403) // SyntaxTree -- Replacement for ParseTree -- Binary '-'
	OpMul    = TokType(404) // SyntaxTree -- Replacement for ParseTree -- Binary '*'
	OpDiv    = TokType(405) // SyntaxTree -- Replacement for ParseTree -- Binary '/'
	OpNUM    = TokType(406) // SyntaxTree -- Replacement for ParseTree -- Numbers
	OpID     = TokType(407) // SyntaxTree -- Replacement for ParseTree -- IDs
	OpAssign = TokType(408) // SyntaxTree -- Replacement for ParseTree -- LValue = Expr
	OpIncr   = TokType(409) // SyntaxTree -- Replacement for ParseTree -- ++ LValue
	OpDecr   = TokType(410) // SyntaxTree -- Replacement for ParseTree -- -- LValue
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

// still used in cg.go - to be depricated for SyntaxTree
//type ParseTree struct {
//	Op     TokType
//	OpName string `json:",omitempty"`
//	St     SymbolTableType
//	Name   string `json:",omitempty"`
//	Value  int
//	Left   *ParseTree `json:",omitempty"`
//	Right  *ParseTree `json:",omitempty"`
//	LineNo int
//	InAcc  bool
//	Source string `json:",omitempty"`
//}

type SyntaxTree struct {
	Op          TokType          //
	OpName      string           `json:",omitempty"`
	SValue      string           //
	IValue      int              //
	Left, Right *SyntaxTree      `json:",omitempty"`
	LineNo      int              //
	St          *SymbolTableType `json:",omitempty"`
}

// The parser expects the lexer to return 0 on EOF.  Give it a unique name for clarity.
const LEX_EOF = 0

// The parser uses the type <prefix>Lex as a lexer. It must provide
// the methods Lex(*<prefix>SymType) int and Error(string).
type exprLex struct {
	Tokens []ScanTokType // func Scanner(fn string) (rv []ScanTokType, err error) {
	Pd     ParseData
}

// ------------------------------------------------------------------------------------------------------------------
// Globals - for the moment.
// ------------------------------------------------------------------------------------------------------------------

var lexx *exprLex
