

// OUTPUT Register 
// ========

var OUTPUT = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/OUTPUT" );
	}
	, "x": {
		  "Name": "OUTPUT"
		, "Group": "Register"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Clr" : { "width": 1, "mode": "i" }
			, "Ld"  : { "width": 1, "mode": "i" }
			, "Inc" : { "width": 1, "mode": "i" }
			, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
		}
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr": if ( val === 1 ) { OUTPUT.x["_Clr_"] = 1; OUTPUT.x["_data_"] = 0; }											OUTPUT.TurnOn( "output_Clr" );   OUTPUT.Display( OUTPUT.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { OUTPUT.x["_Ld_"] = 1; OUTPUT.PullBus(true); OUTPUT.x["_data_"] = OUTPUT.x["_InputBuffer_"]; }	OUTPUT.TurnOn( "output_Ld"  );   OUTPUT.Display( OUTPUT.x["_data_"]); OUTPUT.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { OUTPUT.x["_Inc_"] = 1; OUTPUT.x["_data_"] = OUTPUT.x["_data_"] + 1; }	    				OUTPUT.TurnOn( "output_Inc" );   OUTPUT.Display( OUTPUT.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { OUTPUT.x["_Out_"] = 1; OUTPUT.x["_OutputBuffer_"] = OUTPUT.x["_data_"]; OUTPUT.PushBus(); }   	OUTPUT.TurnOn( "output_Out" );   OUTPUT.Display( OUTPUT.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( OUTPUT.x["_Ld_"] === 1 ) {
			OUTPUT.PullBus();
			OUTPUT.x["_data_"] = OUTPUT.x["_InputBuffer_"];
		}
		if ( OUTPUT.x["_Out_"] === 1 ) {
			OUTPUT.x["_OutputBuffer_"] = OUTPUT.x["_data_"];
			OUTPUT.PushBus();
		}
		OUTPUT.Display( OUTPUT.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		OUTPUT.x["_InputBuffer_"] = null;
		OUTPUT.x["_Clr_"] = null;
		OUTPUT.x["_Ld_"] = null;
		OUTPUT.x["_Inc_"] = null;
		OUTPUT.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( OUTPUT.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 OUTPUT.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "OUTPUT:PullBus", OUTPUT.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "OUTPUT:PushBus", OUTPUT.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( OUTPUT.x["_OutputBuffer_"] );
		}
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
		$("#h_output_txt_0").text(a);
		$("#h_output_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
