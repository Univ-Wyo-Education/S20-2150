#include <stdio.h>

int main() {
	unsigned int x1;	
	int x2;			
	unsigned short x3;			
	short x4;			
	unsigned long int x5;	
	long int x6;			

	printf ( "unsigned int   - sizeof %ld\n", sizeof(x1) );
	printf ( "         int   - sizeof %ld\n", sizeof(x2) );
	printf ( "unsigned short - sizeof %ld\n", sizeof(x3) );
	printf ( "         short - sizeof %ld\n", sizeof(x4) );
	printf ( "unsigned long  - sizeof %ld\n", sizeof(x5) );
	printf ( "         long  - sizeof %ld\n", sizeof(x6) );
}
