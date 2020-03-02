#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main ( int argc, char *argv[] ) {

	int i;
	char *in, *out;

	in = "";
	out = "";

	for ( i = 1; i < argc; i++ ) {
		if ( strcmp ( argv[i], "--in" ) == 0 ) {
			if ( (i+1) < argc ) {
				in = argv[i];
				i++;
			} else {
				fprintf ( stderr, "Error: --in missing file name\n" );
				exit(1);
			}
		} else if ( strcmp ( argv[i], "--out" ) == 0 ) {
			if ( (i+1) < argc ) {
				out = argv[i];
				i++;
			} else {
				fprintf ( stderr, "Error: --out missing file name\n" );
				exit(1);
			}
		} else {
			fprintf ( stderr, "Error: invalid paramter >%s<\n", argv[i] );
			exit(1);
		}
	}

	if ( strcmp(in,"") == 0 ) {
		fprintf ( stderr, "Error: missing --in <fn> parameter\n" );
		exit(1);
	}
	if ( strcmp(out,"") == 0 ) {
		fprintf ( stderr, "Error: missing --out <fn> parameter\n" );
		exit(1);
	}

	/* Add more code */

}
