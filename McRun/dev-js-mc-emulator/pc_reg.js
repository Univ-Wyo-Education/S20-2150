
// PC Register 
// ========

var PC = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/PC" );
		my = {
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
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr": if ( val === 1 ) { my["_data_"] = 0; }										PC.TurnOn( "pc_Clr" );   PC.Display( my["_data_"]); break;
		case "Ld":  if ( val === 1 ) { PC.PullBus(true); my["_data_"] = my["_InputBuffer_"]; }	PC.TurnOn( "pc_Ld"  );   PC.Display( my["_data_"]); my["_Ld_"] = 1; break;
		case "Inc": if ( val === 1 ) { my["_data_"] = my["_data_"] + 1; }	    				PC.TurnOn( "pc_Inc" );   PC.Display( my["_data_"]); break;
		case "Out": if ( val === 1 ) { my["_OutputBuffer_"] = my["_data_"]; PC.PushBus(); }    	PC.TurnOn( "pc_Out" );   PC.Display( my["_data_"]); break;
		case "bus": if ( val === 1 && my["_Ld_"] === 1 ) { PC.PullBus(); my["_data_"] = my["_InputBuffer_"]; }                               break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( my["_Ld_"] === 1 ) {
			PC.PullBus();
			my["_data_"] = my["_InputBuffer_"];
		}
		if ( my["_Out_"] === 1 ) {
			my["_OutputBuffer_"] = my["_data_"];
			PC.PushBus();
		}

		PC.Display( my["_data_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_Clr_"] = null;
		my["_Ld_"] = null;
		my["_Inc_"] = null;
		my["_Out_"] = null;
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

