package mcasm

import (
	"fmt"
	"io/ioutil"
	"testing"
)

func TestMike(t *testing.T) {

	Setup("../../McRun/mm_machine.html", "../../McRun/data")
	// Setup("./static/mm_machine.html", "./static/data")	// In production environment?

	// ../../Mcasm/microcode.m2
	fileData, err := ioutil.ReadFile("../../McAsm/microcode.m2")
	if err != nil {
		t.Fatalf("Failed to read .m2 file")
	}

	nEx, hex, hashHex, stDump, err := Asssemble(string(fileData))
	_ = stDump
	if err != nil {
		t.Fatalf("Failed assemble properly err:%s", err)
	}

	if db2000 {
		fmt.Printf("hashHex ->%s<-\n", hashHex)
		fmt.Printf("hex ->%s<-\n", hex)
		fmt.Printf("nEx %d-\n", nEx)
	}

	if nEx != 56 {
		t.Errorf("Incorrect # of instructions, expected 56 got %d", nEx)
	}

}

var db2000 = false
