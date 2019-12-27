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
	"TokDiv":    TokDiv,
	"TokIncr":   TokIncr,
	"TokDecr":   TokDecr,
	"TokNUM":    TokNUM,
	"TokSem":    TokSem,
	"TokEOF":    TokEOF,

	"PtError": PtError,

	"OpUMinus": OpUMinus,
	"OpAdd":    OpAdd,
	"OpSub":    OpSub,
	"OpMul":    OpMul,
	"OpDiv":    OpDiv,
	"OpNUM":    OpNUM,
	"OpID":     OpID,
	"OpAssign": OpAssign,
	"OpIncr":   OpIncr,
	"OpDecr":   OpDecr,
	"OpInput":  OpInput,
	"OpOutput": OpOutput,
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
	TokDiv:    "TokDiv",
	TokIncr:   "TokIncr",
	TokDecr:   "TokDecr",
	TokNUM:    "TokNUM",
	TokSem:    "TokSem",
	TokEOF:    "TokEOF",

	PtError: "PtError",

	OpUMinus: "OpUMinus",
	OpAdd:    "OpAdd",
	OpSub:    "OpSub",
	OpMul:    "OpMul",
	OpDiv:    "OpDiv",
	OpNUM:    "OpNUM",
	OpID:     "OpID",
	OpAssign: "OpAssign",
	OpIncr:   "OpIncr",
	OpDecr:   "OpDecr",
	OpInput:  "OpInput",
	OpOutput: "OpOutput",
}

func (x TokType) String() string {
	s, ok := LookupTokType[x]
	if ok {
		return s
	}
	return fmt.Sprintf("Invalid TokType[%d]", int(x))
}
