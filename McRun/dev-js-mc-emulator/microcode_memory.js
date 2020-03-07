
// MICROCODE (256 words of 64 wide)
// ========

var MicrocodeFunctions = {
	 "is_halted": showHalt
	,"is_fetch": showFetch
	,"set_execute": function() { showFetch(false); }
	,"is_error": showIsError
	,"hand_out": showHandOut
	,"do_input": do_input
	,"do_output": do_output
	,"McJmp_6": McJmp_6
};

// function showIsError ( isError ) {

function showHandOut( up ) {
	console.log ( "hand_out function called, showHandOut()", up );
	if ( up ) {
//		AddDep ( MICROCODE.x.Name, [ "Microcode_PC_Addr" ], "In", function () {
//			if ( theWorld2["id_ir_Out"] ) {
//				theWorld2["Bus"] = IR.x._data_;
//			} else {
//				theWorld2["Bus"] = IR.x._data_ & 0x0fff;
//			}
//		}
	} else {
	}
}

function McJmp_6( up ) {
	console.log ( "called McJmp_6", up );
	if ( up ) {
		MUX.x._10_6_ = 1;
	} else {
	}
}

function do_input( up ) {
	console.log ( "called do_input", up );
	if ( up ) {
		console.error ( "Input Prompt should have been done" );
		INPUT.x._data_ = 0x2312;
		INPUT.Display( INPUT.x._data_ );
		theWorld2["Input_Data"] = 0x2312;
	} else {
	}
}

function do_output( up ) {
	console.log ( "called do_output", up );
	if ( up ) {
		console.error ( "Output: "+OUTPUT.x._data_.toString(16) );
		theWorld2["Output_Data"] = OUTPUT.x._data_.toString(16);
	} else {
	}
}

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
		var addr = MICROCODE_PC.x["_data_"];																				// kludge!
		MICROCODE.x["_Addr_used_"] = 1;
		// Walk across all the values in the microcode 
		//	- for each one - lookup the line that needs to be turned on 
		//  - turn it on.
		// 	-- Append to _OutputBufferList_ for later use --
		for ( key in MICROCODE.x["_Output_Lines_"] ) {
			var obj = MICROCODE.x["_Output_Lines_"];
			var def = MICROCODE.x["_Output_Lines_"][key];
			var mcWord = MICROCODE.x[def.DataArray][addr];
console.log ( "MICROCODE: Raw On:", "->"+key+"<-", val, 'def.NthBit=', def.NthBit, "mcWord =", Number(mcWord).toString(16), def.DataArray, 'addr=', addr);
			var v2 = MICROCODE.x["_data1_"][addr];
			var v1 = MICROCODE.x["_data2_"][addr];
			if ( v1 === 0 && v2 === 0 ) {
				showIsError ( true );
			}
			var val = ( !!( mcWord & ( 1 << def.NthBit ) ) ) ? 1 : 0;	
			if ( isNaN(def.NthBit) ) {
				console.log ( "MICROCODE: Turn On: isNaN => True" );
			} else if ( val == 1 && "-"+key+"-" != "--" && ! isNaN(def.NthBit) ) {
console.log ( "MICROCODE: Turn On:", "->"+key+"<-", val, 'def.NthBit=', def.NthBit, "mcWord =", Number(mcWord).toString(16), def.DataArray, "    Do It - Push:", key, def );
				MICROCODE.TurnOn( key );
				MICROCODE.x[key] = 1;
				var found = false;
				for ( var ww = 0, wx = MICROCODE.x._OutputBufferList_.length; ww < wx; ww++ ) {
					if ( MICROCODE.x._OutputBufferList_[ww] == key ) {
						found = true;
						break;
					}
				}
				if ( ! found ) {
					MICROCODE.x._OutputBufferList_.push ( key );
				}
				MICROCODE.PushLine( key );
			}
			displayMicrocodeData(addr, v1, v2, MICROCODE.x._OutputBufferList_);
		}
		MICROCODE.Display( addr );
	}
	, msg: function ( wire, val ) {
		MICROCODE.PullAddr();
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
console.log ( "MICROCODE:PullAddr - setup" );
		AddDep ( MICROCODE.x.Name, [ "Microcode_PC_Addr" ], "In", function () {
				// var addr = MICROCODE_PC.x["_OutputBuffer_"];		// Pull in the microcode_pc's output.
				var addr = theWorld2["Microcode_PC_Addr" ];			// Pull in the microcode_pc's output.
				var addr = MICROCODE_PC.x["_data_"];																				// kludge!
				addr = addr & 0xff;
console.log ( "MICROCODE:PullAddr Closure Run, addr=", addr );
				MICROCODE.x["_Addr_"] = addr;
				MICROCODE.impl();
		});													
	}

	, PushLine: function ( key ) {
		AddMsg ( MICROCODE.x.Name, key, "Out", 1 );
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

