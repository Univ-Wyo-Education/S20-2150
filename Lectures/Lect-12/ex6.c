#include <stdio.h>

int main() {
	int x;
	x = 0xE023;					/* Hex value */
	x = x | 0x0100;				/* Set a single bit */
	printf ( "0x%04x (Expect 0xE123)\n", x );	/* Print in Hex */
}
