#include <stdio.h>

int main() {
	int x;
	x = 0x23;					/* Hex value */
	x = ~x;						/* Get the 1s Compliment */
	x &= 0xFFFF;				/* Limit us to 16 bit value */
	printf ( "0x%04x (Expect 0xFFDC)\n", x );	/* Print in Hex */
}
