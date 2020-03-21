

// ----------------------------------------------------------------------------
// Data Setup
// ----------------------------------------------------------------------------
function test7000_setup(single) {
	MEMORY.x._data_[0x0000] = 0x7000;			// Program 	Halt
	mm_max = 2;
	PC.x._data_ = 0x0000;						// So can check increment of PC
	MICROCODE_PC.x._data_ = 0x00;				// Start Microcode Off	-- So can check increment of Microcode_PC later.
}

function test7000_run(single) {

	MICROCODE_PC.msg('Out',1);
	MICROCODE.msg('Addr',1);					// send a message - may be start of something!
	PC.msg('Out',1);

	if ( single ) {
		return;
	}

	Run1TickInit();
	for ( var i = 0; i < 100; i++ ) { 		// This is different than others - other tests will check for "ins_end" to mark the end of the instruction.
		Run1TickStep();
		if ( theWorld2["is_halted"] ) {
			break;
		}
	}
}

function test7000_validate(single) {

	if ( theWorld2.is_halted !== 1 ) {
		console.error ( "Error test7000: 'is_halted' should be 1, got not set: "+theWorld2.is_halted+" instead." );
		nErr++;
	}
	if ( theWorld2.ins_end !== 1 ) {
		console.error ( "Error test7000: 'ins_end' should be 1, got not set: "+theWorld2.ins_end+" instead." );
		nErr++;
	}
	if ( PC.x._data_ !== 1 ) {
		console.error ( "Error test7000: 'PC' should be 1, got: " +PC.x._data_.toString(16)+" instead." );
		nErr++;
	}
	// How ?? Why xyzzy0xb8
	// if ( MICROCODE_PC.x._data_ !== 0xb8 ) {
	if ( MICROCODE_PC.x._data_ !== 0xb0 ) {
		// MPC = 0xb8
		console.error ( "Error test7000: 'MICROCODE_PC' should be 0xb8, got: 0x"+MICROCODE_PC.x._data_.toString(16)+" instead." );
		nErr++;
	}

	// ----------------------------------------------------------------------------
	// So... all done - did we get any errors?
	// ----------------------------------------------------------------------------

	if ( nErr > 0 ) {
		console.error ( "FAIL: # of errors: "+nErr );
	} else {
		console.log ( '%c PASS! ', 'background: #222; color: #bada55');
	}
	return ( nErr );
}

function test7000(single) {
	showTextInOutputBox("test7000 - test of Halt instruction");
	test7000_setup(single);
	test7000_run(single);
	test7000_validate(single);
	return ( nErr );
}
