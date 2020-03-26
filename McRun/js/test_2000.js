

// ----------------------------------------------------------------------------------------------------------------------------------------
// 2000.  Test Load, Halt
// ----------------------------------------------------------------------------------------------------------------------------------------
// test a 2 instruction program with 1 word of data.
// 2000.  Test Load, Halt
//var Connections = {				:2033


// ----------------------------------------------------------------------------
// Data Setup
// ----------------------------------------------------------------------------
function test2000_setup(single) {
	MEMORY.x._data_[0x0000] = 0x1002;			// Program 	Load X
	MEMORY.x._data_[0x0001] = 0x7000;			//			Halt
	MEMORY.x._data_[0x0002] = 0x1230;			// X,       HEX   1230 	
	mm_max = 1024*16;
	PC.x._data_ = 0x0000;						// So can check increment of PC
	MICROCODE_PC.x._data_ = 0x00;				// Start Microcode Off	-- So can check increment of Microcode_PC later.

	MICROCODE_PC.msg('Out',1);
	MICROCODE.msg('Addr',1);					// send a message - may be start of something!
	PC.msg('Out',1);

}

// Standard run 1 instruction code
function test2000_run(single) {
	Run1TickInit();
	for ( var j = 0; j < 10; j++ ) {
		for ( var i = 0; i < 100; i++ ) { 		
			Run1TickStep();
			if ( !!(theWorld2.ins_end === 1) ) {
				break;
			}
		}
		if ( !!(theWorld2.is_halted) ) {
			break;
		}
	}
}

function test2000_validate(single) {

	if ( AC.x._data_ != 0x1230 ) {
		console.error ( "Error test2000: 'AC' should be 0x1230, got not set: "+AC.x._data_.toString(16)+" instead." );
		nErr++;
	}
	if ( theWorld2.ins_end !== 1 ) {
		console.error ( "Error test2000: 'ins_end' should be 1, got not set: "+theWorld2.ins_end+" instead." );
		nErr++;
	}
	if ( PC.x._data_ !== 2 ) {
		console.error ( "Error test2000: 'PC' should be 2, got: " +PC.x._data_+" instead." );
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

function test2000(single) {
	showTextInOutputBox("test2000 - test of Halt instruction");
	test2000_setup(single);
	if ( single ) {
		return;
	}
	test2000_run(single);
	test2000_validate(single);
	return ( nErr );
}


