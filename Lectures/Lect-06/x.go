package main

import "fmt"

/*
Decimal: 4313
Octal: 10331 Hex: 10d9
Decimal 27073
Binary 0b0110100111000001
Octal: 064701 Hex: 0x69c1
*/
func main() {
	n := 4313
	fmt.Printf("Decimal: %d\nOctal: %o Hex: %x\n", n, n, n)
	n = 0x69c1
	fmt.Printf("Decimal %d\nBinary 0b%016b\nOctal: 0%o Hex: 0x%x\n", n, n, n, n)
	// 1001 9
	// 1010 a
	// 1011 b
	// 1100 c
	// 1101 d
	// 1110 e
	// 1111 f
	// 0b_0110_1001_1100_0001
}
