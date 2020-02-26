
// PC Register 
// ========

var PC = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/PC" );
	}
	, "x": {
		  "Name": "PC"
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
		case "Clr": if ( val === 1 ) { PC.x["_Clr_"] = 1; PC.x["_data_"] = 0; }											PC.TurnOn( "pc_Clr" );   PC.Display( PC.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { PC.x["_Ld_"] = 1; PC.PullBus(); PC.x["_data_"] = PC.x["_InputBuffer_"]; }		PC.TurnOn( "pc_Ld"  );   PC.Display( PC.x["_data_"]); PC.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { PC.x["_Inc_"] = 1; }											    				PC.TurnOn( "pc_Inc" );   PC.Display( PC.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { PC.x["_Out_"] = 1; PC.x["_OutputBuffer_"] = PC.x["_data_"]; PC.PushBus(); }   	PC.TurnOn( "pc_Out" );   PC.Display( PC.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		break;
		}
	}
	, tick: function ( ) {
		if ( PC.x["_Ld_"] === 1 ) {
			PC.PullBus();
			PC.x["_data_"] = PC.x["_InputBuffer_"];
		}
		if ( PC.x["_Out_"] === 1 ) {
			PC.x["_OutputBuffer_"] = PC.x["_data_"];
			PC.PushBus();
		}
		PC.Display( PC.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		// xyzzy Step? Run?
		if ( PC.x["_Inc_"] === 1 ) {
			PC.x["_data_"] = PC.x["_data_"] + 1;
			PC.Display( PC.x["_data_"] );
		//	PC.PushBus();
		}
		PC.x["_InputBuffer_"] = null;
		PC.x["_Clr_"] = null;
		PC.x["_Ld_"] = null;
		PC.x["_Inc_"] = null;
		PC.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( PC.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 PC.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "PC:PullBus", PC.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "PC:PushBus", PC.x["_OutputBuffer_"] );
			theWorld.Bus.SetState( PC.x["_OutputBuffer_"] );
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
		$("#h_pc_txt_0").text(a);
		$("#h_pc_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

console.log ( "PC v.1.0.1" );
