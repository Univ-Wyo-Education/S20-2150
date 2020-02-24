#include <stdio.h>

int main() {
	unsigned int x;		
	x = 0xfffffff6;
	x >>= 1;
	printf ( "0x%04x (Expect 0x0 )\n", x );	/* Print in Hex */
	printf ( "%d     (Expect 0x0 )\n", x );	/* Print in Hex */
}
