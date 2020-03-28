package asm

import (
	"fmt"
	"io/ioutil"
	"testing"
)

func TestMARIA_Asm(t *testing.T) {

	Setup("../../McRun/data")
	// Setup( "./static/data")	// In production environment?

	fileData, err := ioutil.ReadFile("../../Asm/hw2.mas")
	if err != nil {
		t.Fatalf("Failed to read .m2 file")
	}

	// func MARIE_Assm(mes string) (n_err int, hex, hashHex, stList string, err error) {
	nErr, hex, hashHex, stList, err := MARIE_Assm(string(fileData))
	_ = stList
	if err != nil {
		t.Fatalf("Failed assemble properly")
		fmt.Printf("err ->%s<-\n", err)
	}

	if db2000 {
		fmt.Printf("hashHex ->%s<-\n", hashHex)
		fmt.Printf("hex ->%s<-\n", hex)
		fmt.Printf("nErr %d-\n", nErr)
	}

	if nErr != 0 {
		t.Errorf("Incorrect # of instructions")
	}

}

var db2000 = false
