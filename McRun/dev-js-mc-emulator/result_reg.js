
// Result Register 
// ========

var RESULT = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/Result" );
		my = {
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
			, "_Out_": null
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		// xyzzy ALU Input
		switch ( wire ) {
		case "Clr": if ( val === 1 ) { my["_data_"] = 0; }												RESULT.TurnOn( "result_Clr" );   RESULT.Display( my["_data_"]); break;
		case "Ld":  if ( val === 1 ) { RESULT.PullBus(true); my["_data_"] = my["_InputBuffer_"]; }		RESULT.TurnOn( "result_Ld"  );   RESULT.Display( my["_data_"]); my["_Ld_"] = 1; break;
		case "Inc": if ( val === 1 ) { my["_data_"] = my["_data_"] + 1; }	    						RESULT.TurnOn( "result_Inc" );   RESULT.Display( my["_data_"]); break;
		case "Out": if ( val === 1 ) { my["_OutputBuffer_"] = my["_data_"]; RESULT.PushBus(); }   		RESULT.TurnOn( "result_Out" );   RESULT.Display( my["_data_"]); break;
		case "bus": if ( val === 1 && my["_Ld_"] === 1 ) { RESULT.PullBus(); my["_data_"] = my["_InputBuffer_"]; }                   break;
		// xyzzy IsZero
		default:
			Error ( "Invalid Message", wire, val );
		}
		if ( my["_data_"] === 0 ) {
			RESULT.SendMsg ( "Result", "is_zero", 1 );
		} else {
			RESULT.SendMsg ( "Result", "is_zero", 0 );
		}
	}
	, tick: function ( ) {
		if ( my["_Ld_"] === 1 ) {
			RESULT.PullBus();
			my["_data_"] = my["_InputBuffer_"];
		}
		if ( my["_Out_"] === 1 ) {
			my["_OutputBuffer_"] = my["_data_"];
			RESULT.PushBus();
		}
		// xyzzy IsZero

		RESULT.Display( my["_data_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_Clr_"] = null;
		my["_Ld_"] = null;
		my["_Inc_"] = null;
		my["_Out_"] = null;
		// xyzzy IsZero
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( my["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 my["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			theWorld.Bus.SetState( my["_OutputBuffer_"] );
		}
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


