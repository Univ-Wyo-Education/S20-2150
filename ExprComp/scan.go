package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"

	"github.com/pschlump/MiscLib"
	"github.com/pschlump/godebug"
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scanner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
	'='
	';'
	'('
	')'
	'+'
	'-'
	'*'
	'-'
	'++'
	'--'
	Number
	ID
	'input'
	'output'
*/

func Scanner(fn string) (rv []ScanTokType, raw []byte, err error) {
	buf, e0 := ioutil.ReadFile(fn)
	if e0 != nil {
		err = fmt.Errorf("Input from %s error %s", fn, e0)
		return
	}
	raw = buf

	errList := make([]string, 0, 2)

	// implement with DFA
	st := 0
	var cc byte
	pos := 0
	line_no := 1
	col_no := 0
	var tbuf bytes.Buffer

	var saveId = func() {
		ID := tbuf.String()
		tbuf.Reset()
		if ID == "in" {
			rv = append(rv, ScanTokType{Tok: TokInput, LineNo: line_no, TokName: TokInput.String(), SM: ID})
		} else if ID == "put" {
			rv = append(rv, ScanTokType{Tok: TokOutput, LineNo: line_no, TokName: TokOutput.String(), SM: ID})
		} else {
			rv = append(rv, ScanTokType{Tok: TokID, Name: ID, LineNo: line_no, TokName: TokID.String(), SM: ID})
		}
	}
	var saveNum = func() {
		Num := tbuf.String()
		tbuf.Reset()
		var nn int64
		if len(Num) > 2 && Num[0:2] == "0b" {
			nn, err = strconv.ParseInt(Num[2:], 2, 32)
		} else {
			nn, err = strconv.ParseInt(Num, 0, 32)
		}
		if err != nil {
			errList = append(errList, fmt.Sprintf("Scanning Error: Line: %d Col %d Invalid Number ->%s<-", line_no, col_no, Num))
		}
		rv = append(rv, ScanTokType{Tok: TokNUM, Value: int(nn), LineNo: line_no, TokName: TokNUM.String(), SM: Num})
	}

Loop:
	for {
		if pos < len(buf) {
			cc = buf[pos]
			if dbScanner01 {
				fmt.Printf("Scanner: Top: pos=%d buf ->%s<- cc %s\n", pos, buf[:pos], string(cc))
			}
			pos++
			col_no++
		} else {
			break Loop
		}

		var Backup1_GotoSt0 = func() {
			pos--
			col_no--
			st = 0
		}
		switch st {
		case 0: // Get Input

			switch {
			case cc == '\n':
				line_no++
				col_no = 0
			case cc == ' ' || cc == '\t':
			case cc == ';':
				rv = append(rv, ScanTokType{Tok: TokSem, LineNo: line_no, TokName: TokSem.String()})
			case cc == '=':
				rv = append(rv, ScanTokType{Tok: TokEq, LineNo: line_no, TokName: TokEq.String()})
			case cc == '(':
				rv = append(rv, ScanTokType{Tok: TokLP, LineNo: line_no, TokName: TokLP.String()})
			case cc == ')':
				rv = append(rv, ScanTokType{Tok: TokRP, LineNo: line_no, TokName: TokRP.String()})
			case cc == '*':
				rv = append(rv, ScanTokType{Tok: TokMul, LineNo: line_no, TokName: TokMul.String()})
			case cc == '/':
				rv = append(rv, ScanTokType{Tok: TokDiv, LineNo: line_no, TokName: TokMul.String()})
			case cc == '+':
				st = 1
			case cc == '-':
				st = 2
			case (cc >= 'a' && cc <= 'z') || (cc >= 'A' && cc <= 'Z'): // ID or 'in' or 'put'
				tbuf.WriteByte(cc)
				st = 30
			case cc >= '1' && cc <= '9':
				tbuf.WriteByte(cc)
				st = 40
			case cc >= '0':
				tbuf.WriteByte(cc)
				st = 41
			}
		case 1: // ++
			if cc == '+' {
				rv = append(rv, ScanTokType{Tok: TokIncr, LineNo: line_no, TokName: TokIncr.String()})
			} else {
				rv = append(rv, ScanTokType{Tok: TokPlus, LineNo: line_no, TokName: TokPlus.String()})
				Backup1_GotoSt0()
			}
			st = 0
		case 2: // --
			if cc == '-' {
				rv = append(rv, ScanTokType{Tok: TokDecr, LineNo: line_no, TokName: TokDecr.String()})
			} else {
				rv = append(rv, ScanTokType{Tok: TokMinus, LineNo: line_no, TokName: TokMinus.String()})
				Backup1_GotoSt0()
			}
			st = 0
		case 30: // ID
			if cc >= 'a' && cc <= 'z' || cc >= 'A' && cc <= 'Z' || cc == '$' || cc == '_' {
				tbuf.WriteByte(cc)
			} else {
				saveId()
				Backup1_GotoSt0()
			}
		case 40: // Number
			// if cc == 'b' || cc == 'x' || cc == 'X' || cc == 'B' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
			if cc >= '0' && cc <= '9' {
				tbuf.WriteByte(cc)
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 41: // 0 Prefix - octal or other...
			if cc == 'b' || cc == 'B' {
				tbuf.WriteByte(cc)
				st = 42
			} else if cc == 'x' || cc == 'X' {
				tbuf.WriteByte(cc)
				st = 44
			} else if cc >= '0' && cc <= '7' {
				tbuf.WriteByte(cc)
				st = 43
			} else if cc >= '8' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in octal number.  Should be 0..7\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
			// if cc >= '0' && cc <= '9' || cc == 'b' || cc == 'x' || cc == 'X' || cc == 'B' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
		case 42: // Binary Number
			if cc >= '0' && cc <= '1' {
				tbuf.WriteByte(cc)
			} else if cc >= '2' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in binary number.  Should be 0 or 1\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 43: // Octal Number
			if cc >= '0' && cc <= '7' {
				tbuf.WriteByte(cc)
			} else if cc >= '8' && cc <= '9' {
				errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<- invalid digit in octal number.  Should be 0..7\n", line_no, col_no, string(cc)))
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		case 44: // Hex Number
			if cc >= '0' && cc <= '9' || cc >= 'a' && cc <= 'f' || cc >= 'A' && cc <= 'F' {
				tbuf.WriteByte(cc)
			} else {
				saveNum()
				Backup1_GotoSt0()
			}
		default: // error
			errList = append(errList, fmt.Sprintf("Scanning error line:%d col%d found ->%s<-\n", line_no, col_no, string(cc)))
		}
	}
	if len(errList) > 0 {
		err = fmt.Errorf("%s", strings.Join(errList, "\n"))
	}
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	rv = append(rv, ScanTokType{Tok: TokEOF, LineNo: line_no, TokName: TokEOF.String()})
	return
}

// ------------------------------------------------------------------------------------------------------------------
// Interface between DFA scanner and goyacc.
// ------------------------------------------------------------------------------------------------------------------

// Lex is called by the parser to get each new token.
func (x *exprLex) Lex(yylval *exprSymType) int {
	ct := x.Tokens[x.Pd.curPos]
	if dbScanner02 {
		fmt.Printf("%s in .Lex - curPos=%d getting token %7d ->%s<->%s<-, at:%s \n%s", MiscLib.ColorYellow, x.Pd.curPos, ct.Tok, ct.SM, ct.TokName, godebug.LF(), MiscLib.ColorReset)
	}
	x.Pd.curPos++
	if ct.Tok == TokNUM {
		if dbScanner02 {
			fmt.Printf("    %s\n", godebug.LF())
		}
		// yylval.tree = NewAst(OpNum, nil, nil, ct.LineNo)
		// yylval.tree.SValue = ct.SM
		// yylval.tree.IValue = ct.Value
		yylval.tree = NewAstNUM(ct.SM, ct.Value, ct.LineNo)
	} else if ct.Tok == TokID {
		if dbScanner02 {
			fmt.Printf("    %s\n", godebug.LF())
		}
		// yylval.tree = NewAst(OpID, nil, nil, ct.LineNo)
		// yylval.tree.SValue = ct.SM
		yylval.tree = NewAstID(ct.SM, ct.LineNo)
	} else if ct.Tok == TokEOF {
		if dbScanner02 {
			fmt.Printf("    %s\n", godebug.LF())
		}
		yylval.tree = nil
		x.Pd.curPos--
		return LEX_EOF
	}
	return int(ct.Tok)

}

// Error is called by the generated parser when an syntax error occurs.
func (x *exprLex) Error(s string) {
	log.Printf("Syntax Error: %s", s)
}

var dbScanner01 = false
var dbScanner02 = false
