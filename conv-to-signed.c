
#include <stdio.h>

int main( int argc, char **argv ) {
	int x = 0xfffd;
	printf ( "x=%d 0x%04d\n", x, x );
	if ( ( x & 0x8000 ) > 0 ) {
		x = x | 0xffff0000 ;
	}
	printf ( "x=%d 0x%04d\n", x, x );
}

