
// AC Register 
// ========

var AC = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/AC" );
	}
	, "x": {
		  "Name": "AC"
		, "Group": "Register"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Clr" : { "width": 1, "mode": "i" }
			, "Ld"  : { "width": 1, "mode": "i" }
			, "Inc" : { "width": 1, "mode": "i" }
			, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
			, "Out_to_ALU" : { "width": 1, "mode": "i" }	// Turn on Output to the ALU
		}
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": null
		, "_Out_to_ALU_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr": if ( val === 1 ) { AC.x["_Clr_"] = 1; AC.x["_data_"] = 0; }											AC.TurnOn( "ac_Clr" );   AC.Display( AC.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { AC.x["_Ld_"] = 1; AC.PullBus(true); AC.x["_data_"] = AC.x["_InputBuffer_"]; }	AC.TurnOn( "ac_Ld"  );   AC.Display( AC.x["_data_"]); AC.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { AC.x["_Inc_"] = 1; AC.x["_data_"] = AC.x["_data_"] + 1; }	    				AC.TurnOn( "ac_Inc" );   AC.Display( AC.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { AC.x["_Out_"] = 1; AC.x["_OutputBuffer_"] = AC.x["_data_"]; AC.PushBus(); }   	AC.TurnOn( "ac_Out" );   AC.Display( AC.x["_data_"]); 						break;
		case "Out_to_ALU": if ( val === 1 ) { AC.x["_ALUOutputBuffer_"] = AC.x["_data_"]; PushBus(); }   TurnOn( "ac_Out_to_ALU" );   Display( AC.x["_data_"]); break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( AC.x["_Ld_"] === 1 ) {
			AC.PullBus();
			AC.x["_data_"] = AC.x["_InputBuffer_"];
		}
		if ( AC.x["_Out_"] === 1 ) {
			AC.x["_OutputBuffer_"] = AC.x["_data_"];
			AC.PushBus();
		}
		if ( AC.x["_Out_to_ALU_"] === 1 ) {
			AC.x["_ALUOutputBuffer_"] = AC.x["_data_"];
			// xyzzy - AC.PushALU() ??
			AC.PushBus();
		}
		AC.Display( AC.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		AC.x["_InputBuffer_"] = null;
		AC.x["_Clr_"] = null;
		AC.x["_Ld_"] = null;
		AC.x["_Inc_"] = null;
		AC.x["_Out_"] = null;
		AC.x["_Out_to_ALU_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( AC.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 AC.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "AC:PullBus", AC.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "AC:PushBus", AC.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( AC.x["_OutputBuffer_"] );
		}
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		var a = sVal.substr(0,2);
		var b = sVal.substr(2,2);
		$("#h_ac_txt_0").text(a);
		$("#h_ac_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

