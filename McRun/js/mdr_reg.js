
// MDR Register 
// ========

var MDR = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MDR" );
	}
	, "x": {
		  "Name": "MDR"
		//, "Interface": {
		//	  "bus" : { "width": 16, "mode": "io" }
		//	, "vcc" : { "width": 1, "mode": "i" }
		//	, "gnd" : { "width": 1, "mode": "i" }
		//	, "Clr" : { "width": 1, "mode": "i" }
		//	, "Ld"  : { "width": 1, "mode": "i" }
		//	, "Inc" : { "width": 1, "mode": "i" }
		//	, "Out" : { "width": 1, "mode": "i" }	// Turn on Output on "bus"
		//}
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
		case "Clr":
			if ( val === 1 ) {
				MDR.x["_Clr_"] = 1;
				MDR.x["_data_"] = 0;
				MDR.TurnOn( "mdr_Clr" );
			}
			MDR.Display( MDR.x["_data_"]); 						
		break;
		case "Ld": 
			if ( val === 1 ) {
				MDR.x["_Ld_"] = 1;
				MDR.PullBus();
				MDR.x["_data_"] = MDR.x["_InputBuffer_"];
				MDR.TurnOn( "mdr_Ld"  );
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		case "Inc":
			if ( val === 1 ) {
				MDR.x["_Inc_"] = 1;
				MDR.x["_data_"] = MDR.x["_data_"] + 1;
				MDR.TurnOn( "mdr_Inc" );
			}	    				
			MDR.Display( MDR.x["_data_"]); 						
		break;
		case "Out":
			if ( val === 1 ) {
				MDR.x["_Out_"] = 1;
				MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
				MDR.PushBus();
				MDR.TurnOn( "mdr_Out" );
			}
			MDR.Display( MDR.x["_data_"]); 						
		break;
		// , "id_memory_Write": [ { Name:"MEMORY",				Op: ["Write"]      	}, { Name:"MDR", Op:["Out_To_Memory"]  } ]
		case "Out_To_Memory":
			if ( val === 1 ) {
console.log ( "Out_To_Memory" );
console.log ( "Out_To_Memory", MAR.x._data_ );
console.log ( "Out_To_Memory" );
				MDR.x["_Out_To_Memory_"] = 1;
				MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
				var addr = MAR.x["_data_"];											// <<<<<<<<<<<<< Peek at MAR!
				if ( addr < 0 || addr >= mm_max ) {
					showIsError ( true );
					MDR.Error ( "Invalid address", wire, addr );
				}
				addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
				MEMORY.x["_data_"][addr] = MDR.x["_OutputBuffer_"];					// <<<<<<<<<<<<< Poke into Memory to set.
			}
			MDR.Display( MDR.x["_data_"]); 						
		break;
		// , "id_memory_Read": [ { Name:"MEMORY",				Op: ["Read"]      	}, { Name:"MDR", Op:["Ld_From_Memory"] } ]
		case "Ld_From_Memory": 
			if ( val === 1 ) {
console.log ( "Ld_From_Memory" );
console.log ( "Ld_From_Memory", MAR.x._data_ );
console.log ( "Ld_From_Memory" );
				MDR.x["_Ld_From_Memory_"] = 1;
				var addr = MAR.x["_data_"];											// <<<<<<<<< Peek at MAR - Should this be the "_OutputBuffer_"
				if ( addr < 0 || addr >= mm_max ) {
					showIsError ( true );
					MDR.Error ( "Invalid address", wire, addr );
				}
				addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
				MDR.x["_InputBuffer_"] = MEMORY.x["_data_"][addr];					// <<<<<<<<< Peek at MEemory!
				MDR.x["_data_"] = MDR.x["_InputBuffer_"];
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		default:
			MDR.Error ( "Invalid Message", wire, val );
		break;
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
		if ( MDR.x["_Out_To_Memory_"] === 1 ) {
			MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
			var addr = MAR.x["_data_"];
			if ( addr < 0 || addr >= mm_max ) {
				showIsError ( true );
				MDR.Error ( "Invalid address", wire, addr );
			}
			addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
			MEMORY.x["_data_"][addr] = MDR.x["_OutputBuffer_"];
		}
		if ( MDR.x["_Ld_From_Memory_"] === 1 ) {
			var addr = MAR.x["_data_"];
			addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
			if ( addr < 0 || addr >= mm_max ) {
				showIsError ( true );
				MDR.Error ( "Invalid address", wire, addr );
			}
			MDR.x["_InputBuffer_"] = MEMORY.x["_data_"][addr];
			MDR.x["_data_"] = MDR.x["_InputBuffer_"];
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
		MDR.x["_Ld_From_Memory_"] = null;
		MDR.x["_Out_To_Memory_"] = null;
	}
	, err: function () {
		return MDR.Error();
	}
	, test_peek: function() {
		return ( MDR.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 MDR.x["_InputBuffer_"] = theWorld.Bus.State();
console.log ( "MDR:PullBus", MDR.x["_InputBuffer_"] );
		}
	}

	, PushBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
console.log ( "MDR:PushBus", MDR.x["_OutputBuffer_"] );
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
		$("#h_mdr_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
