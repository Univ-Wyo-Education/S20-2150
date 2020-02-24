#include <stdio.h>

int main() {
	int x;
	x = 0x23;					/* Hex value */
	x = x ^ 0xF0;				/* Set a single bit */
	printf ( "0x%02x (Expect 0xE123)\n", x );	/* Print in Hex */
}
