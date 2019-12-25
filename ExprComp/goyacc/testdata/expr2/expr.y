// Convert expressions in AST trees - print out.  PJS 1

%{

package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"unicode/utf8"

	"github.com/pschlump/godebug"
)

// "math/big"

%}

%union {
	tree *SyntaxTree
}

%type	<tree>	expr expr0 expr1 expr2 expr3

%token '+' '-' '*' '/' '(' ')' ';' '=' 'i' 'd'

%token	<tree>	NUM
%token	<tree>	ID

%%

top:
	ID '=' expr ';'
	{
		tmp := NewAst ( OpAssign, $1, $3, line_no )
		fmt.Printf ( "Tree: %s\n", godebug.SVarI(tmp) )
	}
|	expr ';'

expr:
 	expr0
|	'i' ID
	{
		$$ = NewAst ( OpIncr, $2, nil, line_no )
	}
|	'd' ID
	{
		$$ = NewAst ( OpDecr, $2, nil, line_no )
	}

expr0:
	expr1
|	'+' expr
	{
		$$ = $2
	}
|	'-' expr
	{
		$$ = NewAst ( OpUMinus, $2, nil, line_no )
	}

expr1:
	expr2
|	expr1 '+' expr2
	{
		$$ = NewAst ( OpAdd, $1, $3, line_no )
	}
|	expr1 '-' expr2
	{
		$$ = NewAst ( OpSub, $1, $3, line_no )
	}

expr2:
	expr3
|	expr2 '*' expr3
	{
		$$ = NewAst ( OpMul, $1, $3, line_no )
	}
|	expr2 '/' expr3
	{
		$$ = NewAst ( OpDiv, $1, $3, line_no )
	}

expr3:
	NUM
|	ID
|	'(' expr ')'
	{
		$$ = $2
	}


%%

// The parser expects the lexer to return 0 on EOF.  Give it a name
// for clarity.
const eof = 0

var line_no = 1

// The parser uses the type <prefix>Lex as a lexer. It must provide
// the methods Lex(*<prefix>SymType) int and Error(string).
type exprLex struct {
	line []byte
	peek rune
}

// The parser calls this method to get each new token. This
// implementation returns operators and NUM.
func (x *exprLex) Lex(yylval *exprSymType) int {
	for {
		c := x.next()
		switch c {
		case eof:
			return eof
		case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
			return x.num(c, yylval)
		case 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j':
			return x.id(c, yylval)
		case '+', '-', '*', '/', '(', ')', ';', '=':
			return int(c)

		// Recognize Unicode multiplication and division
		// symbols, returning what the parser expects.
		case '×':
			return '*'
		case '÷':
			return '/'

		case ' ', '\t', '\r':
		case  '\n':
			line_no++

		default:
			log.Printf("unrecognized character %q", c)
		}
	}
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
	L: for {
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
	yylval.tree = NewAst ( OpNum, nil, nil, line_no )
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
	yylval.tree = NewAst ( OpID, nil, nil, line_no )
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

func main() {
	in := bufio.NewReader(os.Stdin)
	for {
		if _, err := os.Stdout.WriteString("> "); err != nil {
			log.Fatalf("WriteString: %s", err)
		}
		line, err := in.ReadBytes('\n')
		if err == io.EOF {
			return
		}
		if err != nil {
			log.Fatalf("ReadBytes: %s", err)
		}

		exprParse(&exprLex{line: line})
	}
}
