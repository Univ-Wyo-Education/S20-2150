#include <stdio.h>

int main() {
	int x;
	x = 0x12;					/* Hex value */
	x = x & 0x10;				/* Pick out just 1 bit */
	printf ( "0x%04x (Expect 0x0010)\n", x );	/* Print in Hex */
	x = 0x402;					/* Hex value */
	x = x & 0x10;				/* Pick out just 1 bit */
	printf ( "0x%04x (Expect 0x0000)\n", x );	/* Print in Hex */
}

