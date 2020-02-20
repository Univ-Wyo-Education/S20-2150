
// MDR Register 
// ========

var MDR = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MDR" );
	}
	, "x": {
		  "Name": "MDR"
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
		case "Clr": if ( val === 1 ) { MDR.x["_Clr_"] = 1; MDR.x["_data_"] = 0; }											MDR.TurnOn( "mdr_Clr" );   MDR.Display( MDR.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { MDR.x["_Ld_"] = 1; MDR.PullBus(true); MDR.x["_data_"] = MDR.x["_InputBuffer_"]; }	MDR.TurnOn( "mdr_Ld"  );   MDR.Display( MDR.x["_data_"]); MDR.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { MDR.x["_Inc_"] = 1; MDR.x["_data_"] = MDR.x["_data_"] + 1; }	    				MDR.TurnOn( "mdr_Inc" );   MDR.Display( MDR.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { MDR.x["_Out_"] = 1; MDR.x["_OutputBuffer_"] = MDR.x["_data_"]; MDR.PushBus(); }   	MDR.TurnOn( "mdr_Out" );   MDR.Display( MDR.x["_data_"]); 						break;
		// case "bus": if ( val === 1 && MDR.x["_Ld_"] === 1 ) { MDR.PullBus(); MDR.x["_data_"] = MDR.x["_InputBuffer_"]; } 							                          						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( MDR.x["_Ld_"] === 1 ) {
			MDR.PullBus();
			MDR.x["_data_"] = MDR.x["_InputBuffer_"];
		}
		if ( MDR.x["_Out_"] === 1 ) {
			MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
			MDR.PushBus();
		}
		MDR.Display( MDR.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		MDR.x["_InputBuffer_"] = null;
		MDR.x["_Clr_"] = null;
		MDR.x["_Ld_"] = null;
		MDR.x["_Inc_"] = null;
		MDR.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( MDR.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 MDR.x["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			theWorld.Bus.SetState( MDR.x["_OutputBuffer_"] );
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
		$("#h_mdr_txt_0").text(a);
		$("#h_mdr_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
