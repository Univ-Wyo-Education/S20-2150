// Convert expressions in AST trees - print out.  

%{

package main

import (
	"fmt"
	"github.com/pschlump/godebug"
)

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
		tmp := NewAst ( OpAssign, $1, $3, line_no )
		fmt.Printf ( "Tree: %s\n", godebug.SVarI(tmp) )
	}
|	expr ';'

expr:
 	expr0
|	'i' ID
	{
		ValidateLValue($2)
		$$ = NewAst ( OpIncr, $2, nil, line_no )
	}
|	'd' ID
	{
		ValidateLValue($2)
		$$ = NewAst ( OpDecr, $2, nil, line_no )
	}
|	'I' ID
	{
		$$ = NewAst ( OpDecr, $2, nil, line_no )
	}
|	'P' ID
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

