package main

import (
	"flag"
	"fmt"
	"os"
)

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

	lexx = &exprLex{Tokens: tk, Pd: pd}
	exprParse(lexx)
	// global ast has tree -- now in Lexx

	// ---------------------------------- code generate ----------------------------------
	//		ast, e0 := ParseInput(&pd)
	//		if e0 != nil {
	//			fmt.Fprintf(os.Stderr, "Error(s):\n%s\nSyntax Error.  Compile aborted.\n", e0)
	//			os.Exit(1)
	//		}
	//		GenerateCode(ast, out)

	//	// GenerateCode(lexx.Pd.ast, out)
	for _, ast := range astList {
		GenerateCode(ast, out)
	}
	return
}
