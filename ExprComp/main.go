package main

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"os"
	"unicode/utf8"

	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
)

type SyntaxTree struct {
	Op          int
	SValue      string
	IValue      int
	Left, Right *SyntaxTree
	LineNo      int
}

const (
	OpUMinus = 1
	OpAdd    = 2
	OpSub    = 3
	OpMul    = 4
	OpDiv    = 5
	OpNum    = 6
	OpID     = 7
	OpAssign = 8
	OpIncr   = 9
	OpDecr   = 10
)

func NewAst(op int, l, r *SyntaxTree, lno int) *SyntaxTree {
	return &SyntaxTree{Op: op, Left: l, Right: r, LineNo: lno}
}

func ValidateLValue(xx *SyntaxTree) {
}

var lexx *exprLex

// ------------------------------------------------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------------------------------------------------

var In = flag.String("in", "", "Input File - assembly code.")
var Out = flag.String("out", "", "Output in hex.")
var DbFlag = flag.String("db-flag", "", "debug flags.") // xyzzy401 - TODO

func main() {

	flag.Parse() // Parse CLI arguments

	fns := flag.Args()

	if len(fns) > 0 {
		fmt.Fprintf(os.Stderr, "Invalid arguments\n")
		os.Exit(1)
	}

	if *In == "" {
		fmt.Fprintf(os.Stderr, "Unable use --in required parameter\n")
		os.Exit(1)
	}

	in := *In   // Language In
	out := *Out // Assembler out
	_ = out

	// ---------------------------------- scan ----------------------------------

	tk, raw, e0 := Scanner(in)
	if e0 != nil {
		fmt.Fprintf(os.Stderr, "Error(s):\n%s\nCompile error during scanning.  Compile aborted.", e0)
		os.Exit(1)
	}
	pd := ParseData{
		FileName: in,
		LineNo:   1,
		curPos:   0, // Start at beginning
		tokens:   tk,
		errList:  []string{},
	}

	// ---------------------------------- parse ----------------------------------

	lexx = &exprLex{line: raw, Tokens: tk, Pd: pd}
	exprParse(lexx)
	// global ast has tree -- now in Lexx

	//	if false {
	//		ast, e0 := ParseInput(&pd)
	//		if e0 != nil {
	//			fmt.Fprintf(os.Stderr, "Error(s):\n%s\nSyntax Error.  Compile aborted.\n", e0)
	//			os.Exit(1)
	//		}
	//		GenerateCode(ast, out)
	//	}

	// ---------------------------------- code generate ----------------------------------
	if false {
		// GenerateCode(lexx.Pd.ast, out)
		GenerateCode(nil, out)
	}
	return
}

// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------

// The parser expects the lexer to return 0 on EOF.  Give it a name
// for clarity.
const eof = 0

// var line_no = 1

// The parser uses the type <prefix>Lex as a lexer. It must provide
// the methods Lex(*<prefix>SymType) int and Error(string).
type exprLex struct {
	line   []byte
	peek   rune
	Tokens []ScanTokType // func Scanner(fn string) (rv []ScanTokType, err error) {
	Pd     ParseData
}

var nc = 0

// The parser calls this method to get each new token. This
// implementation returns operators and NUM.
func (x *exprLex) Lex(yylval *exprSymType) int {
	ct := x.Tokens[x.Pd.curPos]
	fmt.Printf("%s in .Lex - curPos=%d getting token %7d ->%s<->%s<-, at:%s \n%s", MiscLib.ColorYellow, x.Pd.curPos, ct.Tok, ct.SM, ct.TokName, godebug.LF(), MiscLib.ColorReset)
	x.Pd.curPos++
	nc++
	if nc > 15 {
		os.Exit(1)
	}
	if ct.Tok == TokNum {
		yylval.tree = NewAst(OpNum, nil, nil, ct.LineNo)
		yylval.tree.SValue = ct.SM
		yylval.tree.IValue = ct.Value
	}
	if ct.Tok == TokID {
		yylval.tree = NewAst(OpID, nil, nil, ct.LineNo)
		yylval.tree.SValue = ct.SM
	}
	// yylval.tree = NewAst... Create the appropriate item!
	// yylval.tree.SValue =
	// yylval.tree.IValue =
	x.peek = rune(x.Tokens[x.Pd.curPos].Tok)
	return int(ct.Tok)

	//	for {
	//		c := x.next()
	//		switch c {
	//		case eof:
	//			return eof
	//		case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
	//			return x.num(c, yylval)
	//		case 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j':
	//			return x.id(c, yylval)
	//		case '+', '-', '*', '/', '(', ')', ';', '=':
	//			return int(c)

	//		// Recognize Unicode multiplication and division
	//		// symbols, returning what the parser expects.
	//		case '×':
	//			return '*'
	//		case '÷':
	//			return '/'

	//		case ' ', '\t', '\r':
	//		case '\n':
	//			line_no++

	//		default:
	//			log.Printf("unrecognized character %q", c)
	//		}
	//	}
}

// Lex a number.
func (x *exprLex) num(c rune, yylval *exprSymType) int {
	add := func(b *bytes.Buffer, c rune) {
		if _, err := b.WriteRune(c); err != nil {
			log.Fatalf("WriteRune: %s", err)
		}
	}
	var b bytes.Buffer
	add(&b, c)
L:
	for {
		c = x.next()
		switch c {
		case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'e', 'E':
			add(&b, c)
		default:
			break L
		}
	}
	if c != eof {
		x.peek = c
	}
	yylval.tree = NewAst(OpNum, nil, nil, x.Pd.LineNo)
	yylval.tree.SValue = b.String()
	// xyzzy - convert to int for other things

	//	yylval.num = &big.Rat{}
	//	_, ok := yylval.num.SetString(b.String())
	//	if !ok {
	//		log.Printf("bad number %q", b.String())
	//		return eof
	//	}

	return NUM
}

// Lex an ID
func (x *exprLex) id(c rune, yylval *exprSymType) int {
	add := func(b *bytes.Buffer, c rune) {
		if _, err := b.WriteRune(c); err != nil {
			log.Fatalf("WriteRune: %s", err)
		}
	}
	var b bytes.Buffer
	add(&b, c)
	yylval.tree = NewAst(OpID, nil, nil, x.Pd.LineNo)
	yylval.tree.SValue = b.String()
	return ID
}

// Return the next rune for the lexer.
func (x *exprLex) next() rune {
	if x.peek != eof {
		r := x.peek
		x.peek = eof
		return r
	}
	if len(x.line) == 0 {
		return eof
	}
	c, size := utf8.DecodeRune(x.line)
	x.line = x.line[size:]
	if c == utf8.RuneError && size == 1 {
		log.Print("invalid utf8")
		return x.next()
	}
	return c
}

// The parser calls this method on a parse error.
func (x *exprLex) Error(s string) {
	log.Printf("parse error: %s", s)
}
