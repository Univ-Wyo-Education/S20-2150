


// Test SkipEq0 - Skipcond 000 - Number Larger than 0, but not negative.
function test5030() {

	// ----------------------------------------------------------------------------
	// Data Setup: JnS, JumpI
	// ----------------------------------------------------------------------------
	MEMORY.x._data_[0x0000] = 0x1004;			// Program 	Load X
	MEMORY.x._data_[0x0001] = 0x8400;			//			SkipEq0
	MEMORY.x._data_[0x0002] = 0xA000;			//			Clear
	MEMORY.x._data_[0x0003] = 0x7000;			//			Halt
	MEMORY.x._data_[0x0004] = 0x5900;			//			HEX 5900
	mm_max = 5;
	PC.x._data_ = 0x0000;						// So can check increment of PC
	AC.x._data_ = 0x0000;						// So can check changed AC value
	MICROCODE_PC.x._data_ = 0x00;				// Start Microcode Off	-- So can check increment of Microcode_PC later.





	MICROCODE_PC.msg('Out',1);
	MICROCODE.msg('Addr',1);					// send a message - may be start of something!
	PC.msg('Out',1);

	// Goes to 40
	// Goes to 22

	// Standard run 1 instruction code
	Run1TickInit();
	for ( var j = 0; j < 10; j++ ) {
		// console.error( "Top of loop:",j );
		for ( var i = 0; i < 100; i++ ) { 		
			Run1TickStep();
			// console.error( "bottom of loop:",j ,i );
			if ( !!(theWorld2.ins_end === 1) ) {
				break;
			}
		}
		if ( !!(theWorld2.is_halted) ) {
			break;
		}
	}
	clearOtherLine();

	// Expect 0x0004 in AC
	// Expect PC = 0x0004 (inc of Halt)
	// Expect PC = 0x5900 (inc of Halt)
	if ( AC.x._data_ != 0x5900 ) {
		console.error ( "Error test5010: 'AC' should be 0x5900, got : "+AC.x._data_.toString(16)+" instead." );
		nErr++;
	}
	if ( theWorld2.ins_end !== 1 ) {
		console.error ( "Error test50010: 'ins_end' should be 1, got not set: "+theWorld2.ins_end+" instead." );
		nErr++;
	}
	if ( PC.x._data_ !== 4 ) {
		console.error ( "Error test5010: 'PC' should be 4, got: " +PC.x._data_+" instead." );
		nErr++;
	}


	// ----------------------------------------------------------------------------
	// So... all done - did we get any errors?
	// ----------------------------------------------------------------------------

	if ( nErr > 0 ) {
		console.error ( "FAIL: # of errors: "+nErr );
	} else {
		console.log ( "PASS" );
	}
	return ( nErr );

}



// Test SkipEq0 - Skipcond 000 - Number less than 0, 2s compliment
function test5031() {

	// ----------------------------------------------------------------------------
	// Data Setup: JnS, JumpI
	// ----------------------------------------------------------------------------
	MEMORY.x._data_[0x0000] = 0x1004;			// Program 	Load X
	MEMORY.x._data_[0x0001] = 0x8400;			//			SkipEq0
	MEMORY.x._data_[0x0002] = 0xA000;			//			Clear
	MEMORY.x._data_[0x0003] = 0x7000;			//			Halt
	MEMORY.x._data_[0x0004] = 0x9900;			//			HEX 9900
	mm_max = 5;
	PC.x._data_ = 0x0000;						// So can check increment of PC
	AC.x._data_ = 0x0000;						// So can check changed AC value
	MICROCODE_PC.x._data_ = 0x00;				// Start Microcode Off	-- So can check increment of Microcode_PC later.





	MICROCODE_PC.msg('Out',1);
	MICROCODE.msg('Addr',1);					// send a message - may be start of something!
	PC.msg('Out',1);

	// Went to 40
	// Went to 20

	// Standard run 1 instruction code
	Run1TickInit();
	for ( var j = 0; j < 10; j++ ) {
		// console.error( "Top of loop:",j );
		for ( var i = 0; i < 100; i++ ) { 		
			Run1TickStep();
			// console.error( "bottom of loop:",j ,i );
			if ( !!(theWorld2.ins_end === 1) ) {
				break;
			}
		}
		if ( !!(theWorld2.is_halted) ) {
			break;
		}
	}
	clearOtherLine();

	// Expect 0x0004 in AC
	// Expect PC = 0x0004 (inc of Halt)
	// Expect PC = 0x9900 (inc of Halt)
	if ( AC.x._data_ != 0x9900 ) {
		console.error ( "Error test5010: 'AC' should be 0x9900, got : "+AC.x._data_.toString(16)+" instead." );
		nErr++;
	}
	if ( theWorld2.ins_end !== 1 ) {
		console.error ( "Error test50010: 'ins_end' should be 1, got not set: "+theWorld2.ins_end+" instead." );
		nErr++;
	}
	if ( PC.x._data_ !== 4 ) {
		console.error ( "Error test5010: 'PC' should be 4, got: " +PC.x._data_+" instead." );
		nErr++;
	}


	// ----------------------------------------------------------------------------
	// So... all done - did we get any errors?
	// ----------------------------------------------------------------------------

	if ( nErr > 0 ) {
		console.error ( "FAIL: # of errors: "+nErr );
	} else {
		console.log ( "PASS" );
	}
	return ( nErr );

}





// Test SkipEq0 - Skipcond 000 - Number equal to 0, but not negative.
function test5032() {

	// ----------------------------------------------------------------------------
	// Data Setup: JnS, JumpI
	// ----------------------------------------------------------------------------
	MEMORY.x._data_[0x0000] = 0x1004;			// Program 	Load X
	MEMORY.x._data_[0x0001] = 0x8400;			//			SkipEq0
	MEMORY.x._data_[0x0002] = 0x1005;			//			Load 1234 -> AC
	MEMORY.x._data_[0x0003] = 0x7000;			//			Halt
	MEMORY.x._data_[0x0004] = 0x0000;			//			HEX 0
	MEMORY.x._data_[0x0005] = 0x1234;			//			HEX 1234
	mm_max = 6;
	PC.x._data_ = 0x0000;						// So can check increment of PC
	AC.x._data_ = 0x0000;						// So can check changed AC value
	MICROCODE_PC.x._data_ = 0x00;				// Start Microcode Off	-- So can check increment of Microcode_PC later.





	MICROCODE_PC.msg('Out',1);
	MICROCODE.msg('Addr',1);					// send a message - may be start of something!
	PC.msg('Out',1);

	// Goes to 40
	// Goes to 20

	// Standard run 1 instruction code
	Run1TickInit();
	for ( var j = 0; j < 10; j++ ) {
		// console.error( "Top of loop:",j );
		for ( var i = 0; i < 100; i++ ) { 		
			Run1TickStep();
			// console.error( "bottom of loop:",j ,i );
			if ( !!(theWorld2.ins_end === 1) ) {
				break;
			}
		}
		if ( !!(theWorld2.is_halted) ) {
			break;
		}
	}
	clearOtherLine();

	// Expect 0x0004 in AC
	// Expect PC = 0x0004 (inc of Halt)
	// Expect PC = 0x0000 (inc of Halt)
	if ( AC.x._data_ != 0x0000 ) {
		console.error ( "Error test5010: 'AC' should be 0x0000, got : "+AC.x._data_.toString(16)+" instead." );
		nErr++;
	}
	if ( theWorld2.ins_end !== 1 ) {
		console.error ( "Error test50010: 'ins_end' should be 1, got not set: "+theWorld2.ins_end+" instead." );
		nErr++;
	}
	if ( PC.x._data_ !== 4 ) {
		console.error ( "Error test5010: 'PC' should be 4, got: " +PC.x._data_+" instead." );
		nErr++;
	}


	// ----------------------------------------------------------------------------
	// So... all done - did we get any errors?
	// ----------------------------------------------------------------------------

	if ( nErr > 0 ) {
		console.error ( "FAIL: # of errors: "+nErr );
	} else {
		console.log ( "PASS" );
	}
	return ( nErr );

}

