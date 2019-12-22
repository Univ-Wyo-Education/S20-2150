package main

import (
	"testing"

	"github.com/Univ-Wyo-Education/S20-2150/Mac"
)

func Test_ParseLine(t *testing.T) {
	// func ParseLine(line string, pc AddressType) (label string, op_s string, op OpCodeType, hand string, err error)
	Tests := []struct {
		Line        string
		LnNo        int
		ExpectLabel string
		ExpectOpS   string
		ExpectOp    Mac.OpCodeType
		ExpectHand  string
	}{
		{
			Line:        "AA, Add X      /A Comment\n",
			LnNo:        4,
			ExpectLabel: "AA",
			ExpectOpS:   "Add",
			ExpectOp:    Mac.OpAdd,
			ExpectHand:  "X",
		},
		{
			Line:        " Add X      /A Comment\n",
			LnNo:        5,
			ExpectLabel: "",
			ExpectOpS:   "Add",
			ExpectOp:    Mac.OpAdd,
			ExpectHand:  "X",
		},
		{
			Line:        " Input       /A Comment\n",
			LnNo:        6,
			ExpectLabel: "",
			ExpectOpS:   "Input",
			ExpectOp:    Mac.OpInput,
			ExpectHand:  "",
		},
		{
			Line:        " /A Comment\n",
			LnNo:        7,
			ExpectLabel: "",
			ExpectOpS:   "",
			ExpectHand:  "",
			ExpectOp:    Mac.OpN_A,
		},
		{
			Line:        "/A Comment\n",
			LnNo:        8,
			ExpectLabel: "",
			ExpectOpS:   "",
			ExpectHand:  "",
			ExpectOp:    Mac.OpN_A,
		},
		{
			Line:        "X, /A Comment\n",
			LnNo:        9,
			ExpectLabel: "X",
			ExpectOpS:   "",
			ExpectHand:  "",
			ExpectOp:    Mac.OpN_A,
		},
		{
			Line:        " Input\n",
			LnNo:        1,
			ExpectLabel: "",
			ExpectOpS:   "Input",
			ExpectOp:    Mac.OpInput,
			ExpectHand:  "",
		},
		{
			Line:        " ORG 10\n",
			LnNo:        2,
			ExpectLabel: "",
			ExpectOpS:   "ORG",
			ExpectOp:    Mac.DirORG,
			ExpectHand:  "10",
		},
		{
			Line: " ORG     	 	   0x10\n",
			LnNo:        2,
			ExpectLabel: "",
			ExpectOpS:   "ORG",
			ExpectOp:    Mac.DirORG,
			ExpectHand:  "0x10",
		},
		{
			Line:        "X, DEC -10\n",
			LnNo:        18,
			ExpectLabel: "X",
			ExpectOpS:   "DEC",
			ExpectOp:    Mac.DirDEC,
			ExpectHand:  "-10",
		},
	}

	for nn, test := range Tests {
		label, op_s, op, hand, err := ParseLine(test.Line, test.LnNo)
		if err != nil {
			t.Errorf("[%d] Unexpected error: %s\n", nn, err)
		}
		if test.ExpectLabel != label {
			t.Errorf("[%d] Bad label line %d expected ->%s<- got ->%s<-", nn, test.LnNo, test.ExpectLabel, label)
		}
		if test.ExpectOpS != op_s {
			t.Errorf("[%d] Bad opcode string line %d expected ->%s<- got ->%s<-", nn, test.LnNo, test.ExpectOpS, op_s)
		} else {
			if test.ExpectOp != op {
				t.Errorf("[%d] Bad op:code line %d expected ->%s/%d<- got ->%s/%d<-", nn, test.LnNo, test.ExpectOp, int(test.ExpectOp), op, int(op))
			}
		}
		if test.ExpectHand != hand {
			t.Errorf("[%d] Bad hand line %d expected ->%s<- got ->%s<-", nn, test.LnNo, test.ExpectHand, hand)
		}
	}

}

func Test_ConvHand(t *testing.T) {
	// func ConvHand(hand string) (handVal HandType, err error) {
	Tests := []struct {
		Hand      string
		Expect    Mac.HandType
		ExpectErr bool
	}{
		{
			Hand:      "",
			Expect:    Mac.HandType(-1),
			ExpectErr: false,
		},
		{
			Hand:      "10",
			Expect:    Mac.HandType(10),
			ExpectErr: false,
		},
		{
			Hand:      "0x10",
			Expect:    Mac.HandType(16),
			ExpectErr: false,
		},
		{
			Hand:      "010",
			Expect:    Mac.HandType(8),
			ExpectErr: false,
		},
		{
			Hand:      "0b10",
			Expect:    Mac.HandType(2),
			ExpectErr: false,
		},
		{
			Hand:      "Name",
			Expect:    Mac.HandType(44),
			ExpectErr: false,
		},
	}

	// AddSymbol(Name string, pc AddressType, line_no int) (err error) {
	AddSymbol("Name", Mac.AddressType(44), 4)

	for nn, test := range Tests {
		ht, err := ConvHand(test.Hand)
		if ht != test.Expect {
			t.Errorf("[%d] Bad hand expected ->%d<- got ->%d<-", nn, test.Expect, ht)

		}
		if test.ExpectErr && err == nil {
			t.Errorf("[%d] Expected Error did not get one.", nn)
		}
		if !test.ExpectErr && err != nil {
			t.Errorf("[%d] Got error [%s] when not expected", nn, err)
		}
	}
}

func Test_ComposeInstruction(t *testing.T) {
	// func ComposeInstruction(Op OpCodeType, hand HandType) (ins int) {
	Tests := []struct {
		Op      Mac.OpCodeType
		HandVal Mac.HandType
		Expect  int
	}{
		{
			Op:      Mac.OpCodeType(0x2000),
			HandVal: Mac.HandType(1),
			Expect:  0x2001,
		},
	}

	for nn, test := range Tests {
		iv := ComposeInstruction(test.Op, test.HandVal)
		if iv != test.Expect {
			t.Errorf("[%d] Bad composted opcode ->0x%x<- got ->0x%x<-", nn, iv, test.Expect)
		}
	}
}
