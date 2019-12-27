// Convert expressions in AST trees - print out.  

%{

package main

import (
	"fmt"

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
		ValidateLValue($1)
		ast := NewAst ( OpAssign, $1, $3, lexx.Pd.LineNo )
		astList = append(astList, ast)
		if dbParse1 {
			fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI(ast) )
		}
		$$ = ast 
	}
|	expr ';'
	{
		ast := NewAst ( OpAssign, nil, $1, lexx.Pd.LineNo )
		if dbParse1 {
			fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI(ast) )
		}
		astList = append(astList, ast)
		$$ = ast 
	}
|	GET ID ';'
	{
		ValidateLValue($2)
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}
|	PUT ID ';'
	{
		ValidateLValue($2)
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}

expr:
 	expr0
|	INCR ID
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		ValidateLValue($2)
		$$ = NewAst ( OpIncr, $2, nil, lexx.Pd.LineNo )
	}
|	DECR ID
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		ValidateLValue($2)
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
|	'(' expr ')'
	{
		// fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = $2
	}


%%

