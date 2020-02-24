#include <stdio.h>

int main() {
	int x, op, hand;
	x = 0x4022;					/* Add instruction from address 22 hex */
	op = x & 0xF000;
	op >>= 12;					/* a >>= b  same as a = a >> b */
	hand = x & 0xFFF;
	printf ( "Op = 0x%x, hand = 0x%03x \n", op, hand );	
}
