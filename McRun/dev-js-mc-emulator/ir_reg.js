
// IR Register 
// ========

var IR = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/IR" );
	}
	, "x": {
		  "Name": "IR"
		, "Group": "Register"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Ld"  : { "width": 1, "mode": "i" }
			, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
		}
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Ld_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ld":  if ( val === 1 ) { IR.x["_Ld_"] = 1; IR.PullBus(true); IR.x["_data_"] = IR.x["_InputBuffer_"]; }	IR.TurnOn( "ir_Ld"  );   IR.Display( IR.x["_data_"]); IR.x["_Ld_"] = 1; 	break;
		case "Out": if ( val === 1 ) { IR.x["_Out_"] = 1; IR.x["_OutputBuffer_"] = IR.x["_data_"]; IR.PushBus(); }   	IR.TurnOn( "ir_Out" );   IR.Display( IR.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( IR.x["_Ld_"] === 1 ) {
			IR.PullBus();
			IR.x["_data_"] = IR.x["_InputBuffer_"];
		}
		if ( IR.x["_Out_"] === 1 ) {
			IR.x["_OutputBuffer_"] = IR.x["_data_"];
			IR.PushBus();
		}
		IR.Display( IR.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		IR.x["_InputBuffer_"] = null;
		IR.x["_Ld_"] = null;
		IR.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( IR.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 IR.x["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			theWorld.Bus.SetState( IR.x["_OutputBuffer_"] );
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
		$("#h_ir_txt_0").text(a);
		$("#h_ir_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

