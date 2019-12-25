// Copyright 2014 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// This file holds the go generate command to run yacc on the grammar in expr.y.
// To build expr:
//	% go generate
//	% go build

//go:generate goyacc -o expr.go -p "expr" expr.y

// Expr is a simple expression evaluator that serves as a working example of
// how to use Go's yacc implementation.
package main

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
