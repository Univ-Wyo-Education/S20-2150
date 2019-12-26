package main

import "fmt"

type TokType int

var LookupTokNameType = map[string]TokType{
	"TokID":     TokID,
	"TokEq":     TokEq,
	"TokInput":  TokInput,
	"TokOutput": TokOutput,
	"TokLP":     TokLP,
	"TokRP":     TokRP,
	"TokPlus":   TokPlus,
	"TokMinus":  TokMinus,
	"TokMul":    TokMul,
	"TokIncr":   TokIncr,
	"TokDecr":   TokDecr,
	"TokNUM":    TokNUM,
	"TokSem":    TokSem,
	"TokEOF":    TokEOF,
	"PtExpr":    PtExpr,
	"PtInput":   PtInput,
	"PtOutput":  PtOutput,
	"PtNUM":     PtNUM,
	"PtID":      PtID,
	"PtError":   PtError,
	"PtAdd":     PtAdd,
	"PtSub":     PtSub,
	"PtMul":     PtMul,
	"PtIncr":    PtIncr,
	"PtDecr":    PtDecr,
	"OpUMinus":  OpUMinus,
	"OpAdd":     OpAdd,
	"OpSub":     OpSub,
	"OpMul":     OpMul,
	"OpDiv":     OpDiv,
	"OpNUM":     OpNUM,
	"OpID":      OpID,
	"OpAssign":  OpAssign,
	"OpIncr":    OpIncr,
	"OpDecr":    OpDecr,
}
var LookupTokType = map[TokType]string{
	TokID:     "TokID",
	TokEq:     "TokEq",
	TokInput:  "TokInput",
	TokOutput: "TokOutput",
	TokLP:     "TokLP",
	TokRP:     "TokRP",
	TokPlus:   "TokPlus",
	TokMinus:  "TokMinus",
	TokMul:    "TokMul",
	TokIncr:   "TokIncr",
	TokDecr:   "TokDecr",
	TokNUM:    "TokNUM",
	TokSem:    "TokSem",
	TokEOF:    "TokEOF",
	PtExpr:    "PtExpr",
	PtInput:   "PtInput",
	PtOutput:  "PtOutput",
	PtNUM:     "PtNUM",
	PtID:      "PtID",
	PtError:   "PtError",
	PtAdd:     "PtAdd",
	PtSub:     "PtSub",
	PtMul:     "PtMul",
	PtIncr:    "PtIncr",
	PtDecr:    "PtDecr",
	OpUMinus:  "OpUMinus",
	OpAdd:     "OpAdd",
	OpSub:     "OpSub",
	OpMul:     "OpMul",
	OpDiv:     "OpDiv",
	OpNUM:     "OpNUM",
	OpID:      "OpID",
	OpAssign:  "OpAssign",
	OpIncr:    "OpIncr",
	OpDecr:    "OpDecr",
}

func (x TokType) String() string {
	s, ok := LookupTokType[x]
	if ok {
		return s
	}
	return fmt.Sprintf("Invalid TokType[%d]", int(x))
}
