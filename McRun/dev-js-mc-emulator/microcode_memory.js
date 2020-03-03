
// Microcode (256 words of 64 wide)
// ========

var MicrocodeFunctions = {
	 "is_halted": showHalt
	,"is_fetch": showFetch
	,"set_execute": function() { showFetch(false); }
	,"is_error": showIsError
};

// function showIsError ( isError ) {

var MICROCODE = {
	  "x": {
		  "Name": "MICROCODE"
		, "_data1_": new Array(256)	// 32 bits
		, "_data2_": new Array(256) // 32 bits
		, "_Addr_": null
		, "_Out_": null
		, "_OutputBufferList_": []
		, "_Output_Lines_": {}
		, "_Error_": []
	}
	, impl: function ( ) {
		var addr = MICROCODE.x["_Addr_"];
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
				MICROCODE.PushLine( key );
			}
displayMicrocodeData(addr, v1, v2, MICROCODE.x._OutputBufferList_);
		}
		MICROCODE.Display( addr );
	}
	, msg: function ( wire, val ) {
		MICROCODE.PullAddr();
		var addr = MICROCODE.x["_Addr_"];
console.log ( "Microcode/msg: addr=", addr );
		switch ( wire ) {
		case "Addr":	// This is the "output" from the Microcode_PC
			if ( val === 1 ) {
				MICROCODE.impl();
			}
		break;
		default:
			Error ( "Invalid Message", wire, val );
		break;
		}
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
		return MICROCODE.Error();
	}

	, PullAddr: function () {
		AddDep ( MICROCODE.x.Name, [ "Microcode_PC_Addr" ], "In", function () {
console.log ( "MICROCODE:PullAddr Closure Run" );
				var addr = MICROCODE_PC.x["_OutputBuffer_"];		// Pull in the microcode_pc's output.
				addr = addr & 0xff;
				MICROCODE.x["_Addr_"] = addr;
				MICROCODE.impl();
		});													
	}

	, PushLine: function ( key ) {
		AddMsg ( Microcode.x.Name, key, "Out", 1 );
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
	, Display: function  ( addr ) {
		clearMicrocodeText() ;
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MICROCODE.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MICROCODE.x._Error );
	}

};

/*

// PC Register (new)
// ========

var PC = {
	  "x": {
		  "Name": "PC"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr":				// Act
			if ( val === 1 ) {
				PC.x["_Clr_"] = 1;
				PC.x["_data_"] = 0;
				PC.TurnOn( "pc_Clr" );
			}
			PC.Display( PC.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				PC.x["_Ld_"] = 1;
				PC.PullBus();
			}
			PC.Display( PC.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				PC.x["_Inc_"] = 1;
				PC.TurnOn( "pc_Inc" );
			}
			PC.Display( PC.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				PC.x["_Out_"] = 1;
				PC.x["_OutputBuffer_"] = PC.x["_data_"];
				PC.PushBus();
				PC.TurnOn( "pc_Out" );
			}
			PC.Display( PC.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			PC.rise();
		break;
		default:
			PC.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( PC.x["_Clr_"] === 1 ) {
			PC.x["_data_"] = 0;
			PC.Display( PC.x["_data_"] );
		}
		if ( PC.x["_Inc_"] === 1 ) {
			PC.x["_data_"] = PC.x["_data_"] + 1;
			PC.Display( PC.x["_data_"] );
		}
		if ( PC.x["_Ld_"] === 1 ) {
			PC.Error ( "Failed To Resolve", "Ld", 1 );
		}
		PC.x["_InputBuffer_"] = null;
		PC.x["_Clr_"] = null;
		PC.x["_Ld_"] = null;
		PC.x["_Inc_"] = null;
		PC.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "PC:PullBus New / Add Closure" );
		AddDep ( PC.x.Name, [ "Bus" ], "In", function () {
console.log ( "PC:PullBus Closure Run" );
			 	PC.x["_InputBuffer_"] = theWorld2.Bus;
				PC.x["_data_"] = PC.x["_InputBuffer_"];
				PC.Display( PC.x["_data_"]);
				PC.TurnOn( "pc_Ld"  );
				PC.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "PC:PushBus New/Out:", PC.x._OutputBuffer_ );		
		AddMsg ( PC.x.Name, "Bus", "Out", PC.x._OutputBuffer_ );
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
		if ( errorMsg ) {
			PC.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( PC.x._Error );
	}

};

*/

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

//	, tick: function ( ) {
//		// MICROCODE.PullBus();
//		var addr = MICROCODE.x["_Addr_"];
//console.log ( "Microcode/rise: addr=", addr );
//		if ( MICROCODE.x["_Addr_used_"] === 1 ) {
//			for ( key in MICROCODE.x["_Output_Lines_"] ) {
//				var obj = MICROCODE.x["_Output_Lines_"];
//				var def = MICROCODE.x["_Output_Lines_"][key];
//				var mcWord = MICROCODE.x[def.DataArray][addr];
//				var val = ( !!( mcWord & ( 1 << def.NthBit ) ) ) ? 1 : 0;	
//				if ( isNaN(def.NthBit) ) {
//					console.log ( "Microcode/tick: Turn On: isNaN => True" );
//				} else if ( val == 1 && "-"+key+"-" != "--" && ! isNaN(def.NthBit) ) {
//					MICROCODE.TurnOn( key );
//console.log ( "Microcode/Rise:  Will Call PushBus on:", key );
//					MICROCODE.PushBus( key );
//				}
//			}
//		}
//		MICROCODE.Display( addr );
//	}
