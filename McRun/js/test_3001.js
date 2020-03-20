
// ----------------------------------------------------------------------------------------------------------------------------------------
// Test ALU
// ----------------------------------------------------------------------------------------------------------------------------------------
function test3001_setup(x) {
	// ----------------------------------------------------------------------------
	// Data Setup
	// ----------------------------------------------------------------------------
	// |  0 | 1  |  0 |  0 |    *   |	Add: result = ac + bus (mdr usually)                 |
	//ALU.x._Ctl_0_ = 0;	// Setup to do an ADD
	//ALU.x._Ctl_1_ = 0;
	//ALU.x._Ctl_2_ = 1;
	//ALU.x._Ctl_3_ = 0;

	ALU.rise();

	theWorld2["Bus"] = 7;			// _B_ 
	AC.x["_data_"] = 5;				// _A_
	theWorld2["ac_Out_to_ALU"] = 5;	// _A_
	theWorld2["ALU_Ctl_0"] = 0;		// 0x4 = ADD
	theWorld2["ALU_Ctl_1"] = 0;	
	theWorld2["ALU_Ctl_2"] = 1;	
	theWorld2["ALU_Ctl_3"] = 0;	
	theWorld2["id_ALU_Ctl"] = 0;	

	// ALU.msg("Ctl",1);
	ALU.msg("alu-logic",1);

}

function test3001_run(x) {
	PropagateSignals(); 			
	clearOtherLine(); 	
	if ( x ) {
		console.log ( "AT:"+ln(), theWorld2 , theWorld2WhoSet , theWorld2DepOn );
	}
}

function test3001_validate(x) {

	// ----------------------------------------------------------------------------
	// Validation
	// ----------------------------------------------------------------------------
	if ( theWorld2["ALU_Out"] !== 12 ) {
		console.error ( "Error test3001: 'ALU_Out' should be 0x0d/12, got: " +theWorld2["ALU_Out"]+" instead." );
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

function test3001(x) {
	showTextInOutputBox("test3001 - test of ALU");
	test3001_setup(x);
	test3001_run(x);
	test3001_validate(x);
	return ( nErr );
}
