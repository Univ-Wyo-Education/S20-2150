
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

var MicrocodeFunctions = {
	"is_halted": showHalt
	,"is_fetch": showFetch
	,"set_execute": function() { showFetch(false); }
	,"is_error": showIsError
};

// function showIsError ( isError ) {

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
		MICROCODE.PullBus();
		var addr = MICROCODE.x["_Addr_"];
console.log ( "Microcode/msg: addr=", addr );
		switch ( wire ) {
		case "Addr":	// This is the "output" from the Microcode_PC
			if ( val === 1 ) {
				MICROCODE.x["_Addr_used_"] = 1;
				// Walk across all the values in the microcode 
				//	- for each one - lookup the line that needs to be turned on 
				//  - turn it on.
				// 	-- Append to _OutputBufferList_ for later use --
				for ( key in MICROCODE.x["_Output_Lines_"] ) {
					var obj = MICROCODE.x["_Output_Lines_"];
					var def = MICROCODE.x["_Output_Lines_"][key];
					var mcWord = MICROCODE.x[def.DataArray][addr];
					var v2 = MICROCODE.x["_data1_"][addr];
					var v1 = MICROCODE.x["_data2_"][addr];
					if ( v1 === 0 && v2 === 0 ) {
						showIsError ( true );
					}
					var val = ( !!( mcWord & ( 1 << def.NthBit ) ) ) ? 1 : 0;	
					if ( isNaN(def.NthBit) ) {
						console.log ( "Microcode: Turn On: isNaN => True" );
					} else if ( val == 1 && "-"+key+"-" != "--" && ! isNaN(def.NthBit) ) {
console.log ( "Microcode: Turn On:", "->"+key+"<-", val, 'def.NthBit=', def.NthBit, "mcWord =", Number(mcWord).toString(16), def.DataArray, "    Do It - Push:", key, def );
						MICROCODE.TurnOn( key );
						MICROCODE.x[key] = 1;
						MICROCODE.x._OutputBufferList_.push ( key );
						MICROCODE.PushBus( key );
					}
displayMicrocodeData(addr, v1, v2, MICROCODE.x._OutputBufferList_);
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
		// MICROCODE.PullBus();
		var addr = MICROCODE.x["_Addr_"];
console.log ( "Microcode/rise: addr=", addr );
		if ( MICROCODE.x["_Addr_used_"] === 1 ) {
			for ( key in MICROCODE.x["_Output_Lines_"] ) {
				var obj = MICROCODE.x["_Output_Lines_"];
				var def = MICROCODE.x["_Output_Lines_"][key];
				var mcWord = MICROCODE.x[def.DataArray][addr];
				var val = ( !!( mcWord & ( 1 << def.NthBit ) ) ) ? 1 : 0;	
				if ( isNaN(def.NthBit) ) {
					console.log ( "Microcode/tick: Turn On: isNaN => True" );
				} else if ( val == 1 && "-"+key+"-" != "--" && ! isNaN(def.NthBit) ) {
					MICROCODE.TurnOn( key );
console.log ( "Microcode/Rise:  Will Call PushBus on:", key );
					MICROCODE.PushBus( key );
				}
			}
		}
		MICROCODE.Display( addr );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		for ( key in MICROCODE.x._OutputBufferList_ ) {
			if ( MicrocodeFunctions[key] ) {
				var fx = MicrocodeFunctions[key];
console.log ( "<><> TurnOff: ", key );
				fx(false);
			}
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

	, PullBus: function () {
		// Pull in the address.
		var addr = MICROCODE_PC.x["_OutputBuffer_"];		// Pull in the microcode_pc's output.
		if ( addr === null ) {
			console.log ( "MC Memory: No _addr_ to use." )
			addr = 255;
		}
		MICROCODE.x["_Addr_"] = addr;
	}

	, PushBus: function ( key ) {
		// --------------------------------------------------------------------------------------------
		// Majic Happens !
		// --------------------------------------------------------------------------------------------
		if ( theWorld[key] && typeof theWorld[key].SetState === "function" ) {
			// theWorld[key].SetState( 1 );
console.log ( "Found a PushBus for ", key, " - SetState Called -" );
			theWorld[key].SetState( MICROCODE.x[key] );
		}
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
console.log ( "MICROCOE.TurnOn(",id,");");
		if ( MicrocodeFunctions[key] ) {
			var fx = MicrocodeFunctions[key];
			fx(true);
		} else if ( id.substr ( 0, 3 ) === "id_" ) {
			infoOn1 ( -1, id );
		} else {
			infoOn1 ( -1, "id_"+id );
		}
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
clearMicrocodeText() ;
//		var sVal = toHex(val,4);
//		// console.log ( "Padded", sVal );
//		var a = sVal.substr(0,2);
//		var b = sVal.substr(2,2);
//		$("#h_microcode_txt_0").text(a);
//		$("#h_microcode_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};

