
// Microcode (256 words of 64 wide)
// ========


/*
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
*/


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
		, "_Addr_": null
		, "_Out_": null
		, "_OutputBufferList_": []
		, "_Output_Lines_": {}
	}
	, msg: function ( wire, val ) {
		var addr = MICROCODE_PC.x["_OutputBuffer_"];
		if ( addr === null ) {
			console.log ( "MC Memory: No _addr_ to use." )
			addr = 255;
		}
		MICROCODE.x["_Addr_"] = addr;
		switch ( wire ) {
		case "Addr":	// This is the "output" from the Microcode_PC
			if ( val === 1 ) {
				MICROCODE.x["_Addr_"] = 1;
				// Walk across all the values in the microcode 
				//	- for each one - lookup the line that needs to be turned on 
				//  - turn it on.
				// 	-- Append to _OutputBufferList_ for later use --
				for ( key in MICROCODE.x["_Output_Lines_"] ) {
					var def = MICROCODE.x["_Output_Lines_"][key];
					var mcWord = MICROCODE.x[def.DataArray][addr];
					var val = !!( mcWord & ( 1 << def.NthBit ) );	
					MICROCODE.TurnOn( key );
					MICROCODE.x[key] = 1;
					MICROCODE.x._OutputBufferList_.push ( key );
				}
			}
			MICROCODE.Display( addr );
		break;
		//break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		var addr = MICROCODE_PC.x["_OutputBuffer_"];
		if ( addr === null ) {
			console.log ( "MC Memory: No _addr_ to use." )
			addr = 255;
		}
		MICROCODE.x["_Addr_"] = addr;
		if ( MICROCODE.x["_Addr_"] === 1 ) {
			for ( key in MICROCODE.x["_Output_Lines_"] ) {
				var def = MICROCODE.x["_Output_Lines_"][key];
				var mcWord = MICROCODE.x[def.DataArray][addr];
				var val = !!( mcWord & ( 1 << def.NthBit ) );	
				MICROCODE.TurnOn( key );
			}
		}
		MICROCODE.Display( addr );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		for ( key in MICROCODE.x._OutputBufferList_ ) {
			MICROCODE.x[key] = 0;
		}
		MICROCODE.x._OutputBufferList_ = [];
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( MICROCODE.x["_data_"] );
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

