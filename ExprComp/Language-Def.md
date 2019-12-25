## As a grammar

```

stmt ::= ID '=' expr ';'
	| 'in' ID ';'
	| 'put' ID ';'
	;

expr ::= '(' expr ')'
	| lit '+' expr
	| lit '-' expr
	| lit '*' expr
	| '-' expr
	| lit '++'
	| lit '--'
	| lit
	;

lit ::= Number
	| ID
	;


```



