
// INPUT Register 
// ========

var INPUT = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/INPUT" );
	}
	, "x": {
		  "Name": "INPUT"
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
		case "Clr": if ( val === 1 ) { INPUT.x["_Clr_"] = 1; INPUT.x["_data_"] = 0; }											INPUT.TurnOn( "input_Clr" );   INPUT.Display( INPUT.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { INPUT.x["_Ld_"] = 1; INPUT.PullBus(true); INPUT.x["_data_"] = INPUT.x["_InputBuffer_"]; }	INPUT.TurnOn( "input_Ld"  );   INPUT.Display( INPUT.x["_data_"]); INPUT.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { INPUT.x["_Inc_"] = 1; INPUT.x["_data_"] = INPUT.x["_data_"] + 1; }	    				INPUT.TurnOn( "input_Inc" );   INPUT.Display( INPUT.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { INPUT.x["_Out_"] = 1; INPUT.x["_OutputBuffer_"] = INPUT.x["_data_"]; INPUT.PushBus(); }   	INPUT.TurnOn( "input_Out" );   INPUT.Display( INPUT.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( INPUT.x["_Ld_"] === 1 ) {
			INPUT.PullBus();
			INPUT.x["_data_"] = INPUT.x["_InputBuffer_"];
		}
		if ( INPUT.x["_Out_"] === 1 ) {
			INPUT.x["_OutputBuffer_"] = INPUT.x["_data_"];
			INPUT.PushBus();
		}
		INPUT.Display( INPUT.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		INPUT.x["_InputBuffer_"] = null;
		INPUT.x["_Clr_"] = null;
		INPUT.x["_Ld_"] = null;
		INPUT.x["_Inc_"] = null;
		INPUT.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( INPUT.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 INPUT.x["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "INPUT:PushBus", AC.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( INPUT.x["_OutputBuffer_"] );
		}
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		$("#h_input_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

