package main

import "fmt"

type TokType int

var LookupTokNameType = map[string]TokType{
	"TokID":      TokID,
	"TokEq":      TokEq,
	"TokInput":   TokInput,
	"TokOutput":  TokOutput,
	"TokLP":      TokLP,
	"TokRP":      TokRP,
	"TokPlus":    TokPlus,
	"TokMinus":   TokMinus,
	"TokMul":     TokMul,
	"TokU_Minus": TokU_Minus,
	"TokIncr":    TokIncr,
	"TokDecr":    TokDecr,
	"TokNum":     TokNum,
	"TokSem":     TokSem,
	"TokEOF":     TokEOF,
	"PtExpr":     PtExpr,
	"PtInput":    PtInput,
	"PtOutput":   PtOutput,
	"PtU_Minus":  PtU_Minus,
	"PtNum":      PtNum,
	"PtID":       PtID,
	"PtError":    PtError,
	"PtAdd":      PtAdd,
	"PtSub":      PtSub,
	"PtMul":      PtMul,
	"PtIncr":     PtIncr,
	"PtDecr":     PtDecr,
}
var LookupTokType = map[TokType]string{
	TokID:      "TokID",
	TokEq:      "TokEq",
	TokInput:   "TokInput",
	TokOutput:  "TokOutput",
	TokLP:      "TokLP",
	TokRP:      "TokRP",
	TokPlus:    "TokPlus",
	TokMinus:   "TokMinus",
	TokMul:     "TokMul",
	TokU_Minus: "TokU_Minus",
	TokIncr:    "TokIncr",
	TokDecr:    "TokDecr",
	TokNum:     "TokNum",
	TokSem:     "TokSem",
	TokEOF:     "TokEOF",
	PtExpr:     "PtExpr",
	PtInput:    "PtInput",
	PtOutput:   "PtOutput",
	PtU_Minus:  "PtU_Minus",
	PtNum:      "PtNum",
	PtID:       "PtID",
	PtError:    "PtError",
	PtAdd:      "PtAdd",
	PtSub:      "PtSub",
	PtMul:      "PtMul",
	PtIncr:     "PtIncr",
	PtDecr:     "PtDecr",
}

func (x TokType) String() string {
	s, ok := LookupTokType[x]
	if ok {
		return s
	}
	return fmt.Sprintf("Invalid TokType[%d]", int(x))
}
