// Convert expressions in AST trees - print out.  

%{

package main

import (
	"fmt"
	"os"

	"github.com/pschlump/godebug"
)

var astList = make([]*SyntaxTree, 0, 10)
var dbParse1 = false

%}

%union {
	tree *SyntaxTree
}

%type	<tree>	stmt expr expr0 expr1 expr2 expr3

%token '+' '-' '*' '/' '(' ')' ';' '=' 
%token	<tree>	NUM ID INCR DECR GET PUT

%%

top: 
	stmt
|	top stmt

stmt:
	ID '=' expr ';'
	{
		St, _ := AddSymbol($1.SValue, gLineNo)
		$1.St = &St
		ast := NewAst ( OpAssign, $1, $3, lexx.Pd.LineNo )
		astList = append(astList, ast)
		if dbParse1 {
			fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI(ast) )
		}
		$$ = ast 
	}
|	expr ';'
	{
		if dbParse1 {
			fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI($1) )
		}
		astList = append(astList, $1)
	}
|	GET ID ';'
	{
		$2.St = UseSymbol ( $2.SValue, $2.LineNo ) 
		ValidateLValue($2)
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpInput, $2, nil, lexx.Pd.LineNo )
		astList = append(astList, $$)
	}
|	PUT ID ';'
	{
		$2.St = UseSymbol ( $2.SValue, $2.LineNo ) 
		ValidateLValue($2)
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpOutput, $2, nil, lexx.Pd.LineNo )
		astList = append(astList, $$)
	}

expr:
 	expr0
|	INCR ID
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$2.St = UseSymbol ( $2.SValue, $2.LineNo ) 
		$$ = NewAst ( OpIncr, $2, nil, lexx.Pd.LineNo )
	}
|	DECR ID
	{
		$2.St = UseSymbol ( $2.SValue, $2.LineNo ) 
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}

expr0:
	expr1
|	'+' expr
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = $2
	}
|	'-' expr
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpUMinus, $2, nil, lexx.Pd.LineNo )
	}

expr1:
	expr2
|	expr1 '+' expr2
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpAdd, $1, $3, lexx.Pd.LineNo )
	}
|	expr1 '-' expr2
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpSub, $1, $3, lexx.Pd.LineNo )
	}

expr2:
	expr3
|	expr2 '*' expr3
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpMul, $1, $3, lexx.Pd.LineNo )
	}
|	expr2 '/' expr3
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDiv, $1, $3, lexx.Pd.LineNo )
	}

expr3:
	NUM
|	ID
	{
		$$.St = UseSymbol ( $1.SValue, $1.LineNo ) 
	}
|	'(' expr ')'
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = $2
	}


%%

func UseSymbol ( Name string, LineNo int ) ( rv *SymbolTableType ) {
	st, err := LookupSymbol(Name)
	if err != nil {
		// NParseError++
		fmt.Fprintf(os.Stderr, "Reference to %s symbol not defined. Line:%d\n", Name, LineNo)
	}
	return &st
}

