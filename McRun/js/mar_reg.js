
// MAR Register 
// ========

var MAR = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MAR" );
	}
	, "x": {
		  "Name": "MAR"
		, "Group": "Register"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Ld"  : { "width": 1, "mode": "i" }
			, "Inc" : { "width": 1, "mode": "i" }
			, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
		}
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ld":  if ( val === 1 ) { MAR.x["_Ld_"] = 1; MAR.PullBus(true); MAR.x["_data_"] = MAR.x["_InputBuffer_"]; }	MAR.TurnOn( "mar_Ld"  );   MAR.Display( MAR.x["_data_"]); MAR.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { MAR.x["_Inc_"] = 1; MAR.x["_data_"] = MAR.x["_data_"] + 1; }	    				MAR.TurnOn( "mar_Inc" );   MAR.Display( MAR.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { MAR.x["_Out_"] = 1; MAR.x["_OutputBuffer_"] = MAR.x["_data_"]; MAR.PushBus(); }   	MAR.TurnOn( "mar_Out" );   MAR.Display( MAR.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( MAR.x["_Ld_"] === 1 ) {
			MAR.PullBus();
			MAR.x["_data_"] = MAR.x["_InputBuffer_"];
		}
		if ( MAR.x["_Out_"] === 1 ) {
			MAR.x["_OutputBuffer_"] = MAR.x["_data_"];
			MAR.PushBus();
		}
		MAR.Display( MAR.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		MAR.x["_InputBuffer_"] = null;
		MAR.x["_Ld_"] = null;
		MAR.x["_Inc_"] = null;
		MAR.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( MAR.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 MAR.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "MAR:PullBus", MAR.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "MAR:PushBus", MAR.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( MAR.x["_OutputBuffer_"] );
		}
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		$("#h_mar_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
