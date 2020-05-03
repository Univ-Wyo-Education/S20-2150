package main

import (
	"flag"
	"fmt"
	"os"
)

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

	// ---------------------------------- scan ----------------------------------
	tk, _ /*raw*/, e0 := Scanner(in)
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
	exprErrorVerbose = true
	lexx = &exprLex{Tokens: tk, Pd: pd}
	exprParse(lexx)
	if NParseError > 0 {
		os.Exit(1)
	}

	// ----------------------------------  type check  ----------------------------------
	// Look for ++ LValue, -- LValue
	// Look for LValue = Expr
	// err := TypeCheck ( ast )
	// if err != nil {
	//		xyzzy
	// }

	// ---------------------------------- code generate ----------------------------------
	GenerateCode(astList, out)
	return
}
