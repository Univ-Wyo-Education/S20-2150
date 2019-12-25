package main

import (
	"fmt"
	"os"

	"github.com/pschlump/godebug"
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SymbolTable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

type SymbolTableType struct {
	Name   string `json:",omitempty"`
	LineNo int
	// Address Mac.AddressType // -1 indicates that this is not an assigned address yet
	Value int
}

var SymbolTable map[string]SymbolTableType

func init() {
	SymbolTable = make(map[string]SymbolTableType)
}

func AddSymbol(Name string, line_no int) (st SymbolTableType, err error) {
	if ss, found := SymbolTable[Name]; !found {
		st = SymbolTableType{
			Name:   Name,
			LineNo: line_no,
		}
		SymbolTable[Name] = st
	} else {
		err = fmt.Errorf("Duplicate symbol found.  Original line: %d Current %d - Symbol : %s\n", ss.LineNo, line_no, Name)
	}
	return
}

func LookupSymbol(Name string) (st SymbolTableType, err error) {
	var ok bool
	st, ok = SymbolTable[Name]
	if !ok {
		err = fmt.Errorf("Not Found")
	}
	return
}

// Lookup const will look for a constant in the symbol table - if  it is not found
// then it will add it in the form _Num to the table.
func LookupConst(Val int, line_no int) (st SymbolTableType, err error) {
	key := fmt.Sprintf("_%d", uint(Val))
	var ok bool
	st, ok = SymbolTable[key]
	if ok {
		return
	}
	_, err = AddSymbol(key, line_no)
	st, _ = SymbolTable[key]
	st.Value = Val
	SymbolTable[key] = st
	return
}

var nt = 0

func ResetTemp() {
	nt = 0
}

func AllocateTemp(line_no int) (name string) {
	name = fmt.Sprintf("_tmp%d", nt)
	nt++
	_, ok := SymbolTable[name]
	if ok {
		return
	}
	AddSymbol(name, line_no)
	return
}

func GenSymbols(ofp *os.File) {
	fmt.Fprintf(ofp, "\n/Symbols\n")
	for key, vv := range SymbolTable {
		fmt.Fprintf(ofp, "%s, DEC %d     // LineNo:%d\n", key, vv.Value, vv.LineNo)
	}
}

func DumpSymbolTable() {
	fmt.Printf("Symbol Table\n")
	fmt.Printf("-------------------------------------------------------------\n")
	for key, val := range SymbolTable {
		fmt.Printf("%s: %s\n", key, godebug.SVar(val))
	}
	fmt.Printf("-------------------------------------------------------------\n\n")
}
