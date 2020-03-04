#include <string>
#include <iostream>
#include <algorithm>
#include <unistd.h>

using namespace std;

int main(int argc, char** argv) {

	int i;
	char *in, *out;
	
	in = NULL;
	out = NULL;

	for ( i = 1; i < argc; i++ ) {
		if ( strcmp ( argv[i], "--in" ) == 0 ) {
			if ( (i+1) < argc ) {
				in = argv[i];
				i++;
			} else {
				cerr << "Error: --in missing file name\n" ;
				exit(1);
			}
		} else if ( strcmp ( argv[i], "--out" ) == 0 ) {
			if ( (i+1) < argc ) {
				out = argv[i];
				i++;
			} else {
				cerr << "Error: --out missing file name\n";
				exit(1);
			}
		} else {
			cerr << "Error: invalid parameter >" << argv[i] << "<\n";
			exit(1);
		}
	}

	if ( in == NULL ) {
		cerr << "Error: missing --in <fn> parameter\n" ;
		exit(1);
	}
	if ( out == NULL ) {
		cerr << "Error: missing --out <fn> parameter\n" ;
		exit(1);
	}

    // TODO: Add more code 

    // Read in Input file into `memory` 

    // Loop until 'Halt' instruction 

        // Fetch 

        // Execute 

}
