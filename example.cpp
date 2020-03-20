
	int op, ir, pc, x;
	pc = 0;

	while ( op != 0x7 ) {

		// Fetch
		ir = mem[pc];	// 0x1hhh Load instruction
		op = ( ir & 0xf000 ) >> 12;		// 0x1
		x = ( ir & 0x0fff );
		pc++;

		// Execute

		switch ( op ) {
		case 0x0:
		break;
		case 0x1:
		break;
		// ...
		}
		
	}

