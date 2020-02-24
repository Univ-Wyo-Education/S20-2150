#include <stdio.h>

int main() {
	int x;		
	x = -10;		
	printf ( "0x%08x (Expect 0xFFF*b)\n", x );	/* Print in Hex */
	x >>= 1;
	printf ( "0x%04x (Expect 0xFFF*b)\n", x );	/* Print in Hex */
	printf ( "%d     (Expect -5)\n", x );	
}
