
// Result Register 
// ========

var RESULT = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/Result" );
	}
	, "x": {
		  "Name": "Result"
		, "Group": "Register"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Clr" : { "width": 1, "mode": "i" }
			, "Ld"  : { "width": 1, "mode": "i" }
			, "Inc" : { "width": 1, "mode": "i" }
			, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
			, "IsZero" : { "width": 1, "mode": "o" }	// Turn on Output on "bus"
		}
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": 1
	}
	, msg: function ( wire, val ) {
		// xyzzy ALU Input
		RESULT.x["_"+wire+"_"] = 1;
		switch ( wire ) {
		case "Clr":
			if ( val === 1 ) {
				RESULT.x["_data_"] = 0;
			}
			RESULT.TurnOn( "result_Clr" );
			RESULT.Display( RESULT.x["_data_"]);
		break;
		case "Ld": 
			if ( val === 1 ) {
				RESULT.PullBus(true);
				RESULT.x["_data_"] = RESULT.x["_InputBuffer_"];
			}	
			RESULT.TurnOn( "result_Ld"  );  
			RESULT.Display( RESULT.x["_data_"]);
			RESULT.x["_Ld_"] = 1;
		break;
		case "Inc":
			if ( val === 1 ) {
				RESULT.x["_data_"] = RESULT.x["_data_"] + 1;
			}	
			RESULT.TurnOn( "result_Inc" );  
			RESULT.Display( RESULT.x["_data_"]);
		break;
		case "Out":
			if ( val === 1 ) {
				console.log ( "msg.out", RESULT.x, wire, val );
			 	RESULT.x["_OutputBuffer_"] = RESULT.x["_data_"];
				RESULT.PushBus();
			}
			RESULT.TurnOn( "result_Out" );
			RESULT.Display( RESULT.x["_data_"]);
		break;
		// case "bus": if ( val === 1 && RESULT.x["_Ld_"] === 1 ) { RESULT.PullBus(); RESULT.x["_data_"] = RESULT.x["_InputBuffer_"]; }                   break;
		// xyzzy IsZero
		default:
			Error ( "Invalid Message", wire, val );
		}
		if ( RESULT.x["_data_"] === 0 ) {
			RESULT.SendMsg ( "Result", "is_zero", 1 );
		} else {
			RESULT.SendMsg ( "Result", "is_zero", 0 );
		}
	}
	, tick: function ( ) {
console.log ( "Result:Tick", RESULT.x );
		if ( RESULT.x["_Ld_"] === 1 ) {
			RESULT.PullBus();
console.log ( "Result:Tick Ld: _InputBuffer_ =", RESULT.x["_InputBuffer_"] );
			RESULT.x["_data_"] = RESULT.x["_InputBuffer_"];
		}
		if ( RESULT.x["_Out_"] === 1 ) {
			RESULT.x["_OutputBuffer_"] = RESULT.x["_data_"];
console.log ( "Result:Tick Out: _OutputBuffer =", RESULT.x["_OutputBuffer_"] );
			RESULT.PushBus();
		}
		// xyzzy IsZero
		RESULT.Display( RESULT.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		// xyzzy IsZero
		RESULT.x["_InputBuffer_"] = null;
		RESULT.x["_Clr_"] = null;
		RESULT.x["_Ld_"] = null;
		RESULT.x["_Inc_"] = null;
		RESULT.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( RESULT.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 RESULT.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "Result:PullBus", RESULT.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			theWorld.Bus.SetState( RESULT.x["_OutputBuffer_"] );
console.log ( "Result:PushBus", RESULT.x["_OutputBuffer_"] );
		}

		var dd = IR.x["_data_"];
	
		// Xyzzy ??  -- do you need to run on an output to do this?
		MUX.msg("01_1", ( dt != 0 ) ? 1 : 0 );

//	, "McJmp_7": { Name: "MUX", 					Op: ["00_7","01_7","10_7","11_7"] }
//	, "McJmp_6": { Name: "MUX", 					Op: ["00_6","01_6","10_6"       ] }
//	, "McJmp_5": { Name: "MUX", 					Op: ["00_5","01_5"              ] }
//	, "McJmp_4": { Name: "MUX", 					Op: ["00_4","01_4"              ] }
//	, "McJmp_3": { Name: "MUX", 					Op: ["00_3","01_3"              ] }
//	, "McJmp_2": { Name: "MUX", 					Op: ["00_2","01_2"       ,"11_2"] }	
//	, "McJmp_1": { Name: "MUX", 					Op: ["00_1"       ,"10_1","11_1"] }
//	, "McJmp_0": { Name: "MUX", 					Op: ["00_0","01_0","10_0","11_0"] }

	}

	, SendMsg: function ( x, y, val ) {
		// xyzzy - implement
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		// console.log ( "Padded", sVal );
		var a = sVal.substr(0,2);
		var b = sVal.substr(2,2);
		$("#h_result_txt_0").text(a);
		$("#h_result_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );	 // xyzzy - needs fix!
	}

};


