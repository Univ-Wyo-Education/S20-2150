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
		fmt.Printf ( "Tree: %s\n", godebug.SVarI(ast) )
	}
|	expr ';'

expr:
 	expr0
|	'i' ID
	{
		ValidateLValue($2)
		$$ = NewAst ( OpIncr, $2, nil, lexx.Pd.LineNo )
	}
|	'd' ID
	{
		ValidateLValue($2)
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}
|	'I' ID
	{
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}
|	'P' ID
	{
		$$ = NewAst ( OpDecr, $2, nil, lexx.Pd.LineNo )
	}

expr0:
	expr1
|	'+' expr
	{
		$$ = $2
	}
|	'-' expr
	{
		$$ = NewAst ( OpUMinus, $2, nil, lexx.Pd.LineNo )
	}

expr1:
	expr2
|	expr1 '+' expr2
	{
		$$ = NewAst ( OpAdd, $1, $3, lexx.Pd.LineNo )
	}
|	expr1 '-' expr2
	{
		$$ = NewAst ( OpSub, $1, $3, lexx.Pd.LineNo )
	}

expr2:
	expr3
|	expr2 '*' expr3
	{
		$$ = NewAst ( OpMul, $1, $3, lexx.Pd.LineNo )
	}
|	expr2 '/' expr3
	{
		$$ = NewAst ( OpDiv, $1, $3, lexx.Pd.LineNo )
	}

expr3:
	NUM
|	ID
|	'(' expr ')'
	{
		$$ = $2
	}


%%

