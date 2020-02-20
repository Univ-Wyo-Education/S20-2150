
// Microcode (256 words of 64 wide)
// ========


function OldPushBus() {
	var addr = my["_Addr_"];
	if ( addr === null ) {
		console.log ( "MC Memory: No _addr_ to use." )
		addr = 255;
	}
	for ( key in my["_Output_Lines_"] ) {
		var def = my["_Output_Lines_"][key];
		var mcWord = my[def.DataArray][addr];
		var val = !!( mcWord & ( 1 << def.NthBit ) );	
		if(theOutsideWorld[key] && typeof theOutsideWorld[key].SetState === "function") {
			theOutsideWorld[key].SetState( val );
		} else {
			console.log ( "MC Memory: No output connected to:", key )
		}
	}
}


var MICROCODE = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MICROCODE" );
	}
	, "x": {
		  "Name": "MICROCODE"
		, "Group": "Memory"
		, "Interface": {
			  "Out" : { "width": 64, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
		}
		, "_data1_": new Array(256)	// 32 bits
		, "_data2_": new Array(256) // 32 bits
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Addr_": null
		, "_Inc_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr": if ( val === 1 ) { MICROCODE.x["_Clr_"] = 1; MICROCODE.x["_data_"] = 0; }											MICROCODE.TurnOn( "microcode_Clr" );   MICROCODE.Display( MICROCODE.x["_data_"]); 						break;
		case "Ld":  if ( val === 1 ) { MICROCODE.x["_Ld_"] = 1; MICROCODE.PullBus(true); MICROCODE.x["_data_"] = MICROCODE.x["_InputBuffer_"]; }	MICROCODE.TurnOn( "microcode_Ld"  );   MICROCODE.Display( MICROCODE.x["_data_"]); MICROCODE.x["_Ld_"] = 1; 	break;
		case "Inc": if ( val === 1 ) { MICROCODE.x["_Inc_"] = 1; MICROCODE.x["_data_"] = MICROCODE.x["_data_"] + 1; }	    				MICROCODE.TurnOn( "microcode_Inc" );   MICROCODE.Display( MICROCODE.x["_data_"]); 						break;
		case "Out": if ( val === 1 ) { MICROCODE.x["_Out_"] = 1; MICROCODE.x["_OutputBuffer_"] = MICROCODE.x["_data_"]; MICROCODE.PushBus(); }   	MICROCODE.TurnOn( "microcode_Out" );   MICROCODE.Display( MICROCODE.x["_data_"]); 						break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( MICROCODE.x["_Ld_"] === 1 ) {
			MICROCODE.PullBus();
			MICROCODE.x["_data_"] = MICROCODE.x["_InputBuffer_"];
		}
		if ( MICROCODE.x["_Out_"] === 1 ) {
			MICROCODE.x["_OutputBuffer_"] = MICROCODE.x["_data_"];
			MICROCODE.PushBus();
		}
		MICROCODE.Display( MICROCODE.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		MICROCODE.x["_InputBuffer_"] = null;
		MICROCODE.x["_Addr_"] = null;
		MICROCODE.x["_Inc_"] = null;
		MICROCODE.x["_Out_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( MICROCODE.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 MICROCODE.x["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			theWorld.Bus.SetState( MICROCODE.x["_OutputBuffer_"] );
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
		$("#h_microcode_txt_0").text(a);
		$("#h_microcode_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
