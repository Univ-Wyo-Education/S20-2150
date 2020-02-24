#include <stdio.h>

int main() {
	int x;
	x = 0xE023;					/* Hex value */
	x = x & 0xF000;				/* Pick out just 4 bit */
	x = x >> 12;				/* Shift it over */
	printf ( "0x%04x (Expect 0x000E)\n", x );	/* Print in Hex */
}
