package Mac

import "fmt"

//----------------------------------------------------------------------------------------------------------------
// Language Specification
//----------------------------------------------------------------------------------------------------------------
//
//  [Label,]		Op	Hand	[/comment.*]
//
//	Pseudo Ops
//		ORG	<number>				Set current memory location to
//	Instructions
//
//----------------------------------------------------------------------------------------------------------------

type KindType int

const (
	KindInstruction = KindType(1)
	KindDirective   = KindType(2)
)

type OpCodeType int

const (
	OpJnS        = OpCodeType(0x0000) // JnS	-- Subroutine call:w
	OpLoad       = OpCodeType(0x1000)
	OpStore      = OpCodeType(0x2000)
	OpAdd        = OpCodeType(0x3000)
	OpSubt       = OpCodeType(0x4000)
	OpInput      = OpCodeType(0x5000)
	OpOutput     = OpCodeType(0x6000)
	OpHalt       = OpCodeType(0x7000)
	OpSkipcond   = OpCodeType(0x8000)
	OpJump       = OpCodeType(0x9000)
	OpClear      = OpCodeType(0xA000)
	OpSkipLt0    = OpCodeType(0x8000) // 00
	OpSkipEq0    = OpCodeType(0x8400) // 01
	OpSkipGt0    = OpCodeType(0x8800) // 10
	OpAddI       = OpCodeType(0xB000)
	OpJumpI      = OpCodeType(0xc000)
	OpLoadI      = OpCodeType(0xd000)
	OpStoreI     = OpCodeType(0xe000)
	OpN_A        = OpCodeType(0xffff)
	DirORG       = OpCodeType(90001)
	DirDEC       = OpCodeType(90002)
	DirHEX       = OpCodeType(90003)
	DirOCT       = OpCodeType(90004)
	DirBIN       = OpCodeType(90005)
	DirSTR       = OpCodeType(90006)
	DirCHR       = OpCodeType(90007)
	DirBlankLine = OpCodeType(90000)
	// AddI 11
	// JumpI 12
	// LoadI 13
	// StoreI 14
	// Unused 15
)

type FmtType int

const (
	OpFormatStandard = FmtType(0)
	OpFormatExtended = FmtType(1)
)

var OpTab = map[string]OpCodeType{
	"":         OpN_A,
	"add":      OpAdd,
	"subt":     OpSubt,
	"halt":     OpHalt,
	"load":     OpLoad,
	"store":    OpStore,
	"input":    OpInput,
	"output":   OpOutput,
	"jump":     OpJump,
	"jns":      OpJnS,
	"clear":    OpClear,
	"skipcond": OpSkipcond,
	"skiplt0":  OpSkipLt0,
	"skipeq0":  OpSkipEq0,
	"skipgt0":  OpSkipGt0,
	"addi":     OpAddI,
	"jumpi":    OpJumpI,
	"loadi":    OpLoadI,
	"storei":   OpStoreI,
	"org":      DirORG,
	"dec":      DirDEC,
	"hex":      DirHEX,
	"oct":      DirOCT,
	"bin":      DirBIN,
	"str":      DirSTR,
	"chr":      DirCHR,
}

var OpTabStr = map[OpCodeType]string{
	OpAdd:     "Add",
	OpSubt:    "Subt",
	OpHalt:    "Halt",
	OpLoad:    "Load",
	OpStore:   "Store",
	OpInput:   "Input",
	OpOutput:  "Output",
	OpJump:    "Jump",
	OpJnS:     "JnS",
	OpClear:   "Clear",
	OpSkipLt0: "SkipLt0",
	OpSkipEq0: "SkipEq0",
	OpSkipGt0: "SkipGt0",
	OpAddI:    "AddI",
	OpJumpI:   "JumpI",
	OpLoadI:   "LoadI",
	OpStoreI:  "StoreI",
	DirORG:    "ORG",
	DirDEC:    "DEC",
	DirHEX:    "HEX",
	DirOCT:    "OCT",
	DirBIN:    "BIN",
	DirSTR:    "STR",
	DirCHR:    "CHR",
}

func (x OpCodeType) String() string {
	if s, ok := OpTabStr[x]; ok {
		return s
	}
	return fmt.Sprintf("Invalid %d Opcode", int(x))
}

type AddressType int
type HandType int
