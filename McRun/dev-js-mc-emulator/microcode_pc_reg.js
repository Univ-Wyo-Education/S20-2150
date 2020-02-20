
// MICROCODE_PC Register 
// ========

var MICROCODE_PC = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MICROCODE_PC" );
	}
	, "x": {
		  "Name": "MICROCODE_PC"
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
		case "Clr": if ( val === 1 ) { MICROCODE_PC.x["_Clr_"] = 1; MICROCODE_PC.x["_data_"] = 0; }											MICROCODE_PC.TurnOn( "microcode_pc_Clr" );   MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { MICROCODE_PC.x["_Ld_"] = 1; MICROCODE_PC.PullBus(true); MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"]; }	MICROCODE_PC.TurnOn( "microcode_pc_Ld"  );   MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); MICROCODE_PC.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { MICROCODE_PC.x["_Inc_"] = 1; MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_data_"] + 1; }	    				MICROCODE_PC.TurnOn( "microcode_pc_Inc" );   MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { MICROCODE_PC.x["_Out_"] = 1; MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"]; MICROCODE_PC.PushBus(); }   	MICROCODE_PC.TurnOn( "microcode_pc_Out" );   MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 						break;
		// case "bus": if ( val === 1 && MICROCODE_PC.x["_Ld_"] === 1 ) { MICROCODE_PC.PullBus(); MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"]; } 							                          						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( MICROCODE_PC.x["_Ld_"] === 1 ) {
			MICROCODE_PC.PullBus();
			MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"];
		}
		if ( MICROCODE_PC.x["_Out_"] === 1 ) {
			MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
			MICROCODE_PC.PushBus();
		}
		MICROCODE_PC.Display( MICROCODE_PC.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		MICROCODE_PC.x["_InputBuffer_"] = null;
		MICROCODE_PC.x["_Clr_"] = null;
		MICROCODE_PC.x["_Ld_"] = null;
		MICROCODE_PC.x["_Inc_"] = null;
		MICROCODE_PC.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( MICROCODE_PC.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 MICROCODE_PC.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "MICROCODE_PC:PullBus", MICROCODE_PC.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "MICROCODE_PC:PushBus", MICROCODE_PC.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( MICROCODE_PC.x["_OutputBuffer_"] );
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
		$("#h_microcode_pc_txt_0").text(a);
		$("#h_microcode_pc_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

