#include <stdio.h>

int main() {
	int x;
	x = 0x12;					/* Hex value */
	x = x & 0x10;				/* Pick out just 1 bit */
	printf ( "0x%x (Expect 0x10)\n", x );	/* Print in Hex */
	x = 0x402;					/* Hex value */
	x = x & 0x10;				/* Pick out just 1 bit */
	printf ( "0x%x (Expect 0x0)\n", x );	/* Print in Hex */
}
