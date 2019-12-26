// Convert expressions in AST trees - print out.  

%{

package main

import (
	"fmt"

	"github.com/pschlump/godebug"
)

var ast *ParseTree;

%}

%union {
	tree *SyntaxTree
}

%type	<tree>	expr expr0 expr1 expr2 expr3

%token '+' '-' '*' '/' '(' ')' ';' '=' 'i' 'd' 'I' 'P'

%token	<tree>	NUM
%token	<tree>	ID

%%

top:
	ID '=' expr ';'
	{
		ValidateLValue($1)
		lexx.Pd.ast = NewAst ( OpAssign, $1, $3, lexx.Pd.LineNo )
		fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI(lexx.Pd.ast) )
	}
|	expr ';'
	{
		lexx.Pd.ast = NewAst ( OpAssign, nil, $1, lexx.Pd.LineNo )
		fmt.Printf ( "AT: %s Tree: %s\n", godebug.LF(), godebug.SVarI(lexx.Pd.ast) )
	}

expr:
 	expr0
|	'i' ID
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		ValidateLValue($2)
		$$ = NewAst ( OpIncr, $2, nil, lexx.Pd.LineNo )
	}
|	'd' ID
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		ValidateLValue($2)
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}
|	'I' ID
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}
|	'P' ID
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}

expr0:
	expr1
|	'+' expr
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = $2
	}
|	'-' expr
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpUMinus, $2, nil, lexx.Pd.LineNo )
	}

expr1:
	expr2
|	expr1 '+' expr2
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpAdd, $1, $3, lexx.Pd.LineNo )
	}
|	expr1 '-' expr2
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpSub, $1, $3, lexx.Pd.LineNo )
	}

expr2:
	expr3
|	expr2 '*' expr3
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpMul, $1, $3, lexx.Pd.LineNo )
	}
|	expr2 '/' expr3
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = NewAst ( OpDiv, $1, $3, lexx.Pd.LineNo )
	}

expr3:
	NUM
|	ID
|	'(' expr ')'
	{
		fmt.Printf ( "AT:%s\n", godebug.LF())
		$$ = $2
	}


%%

