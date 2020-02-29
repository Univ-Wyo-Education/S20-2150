
// MDR Register (new)
// ========

var MDR = {
	  "x": {
		  "Name": "MDR"
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
				MDR.x["_Clr_"] = 1;
				MDR.x["_data_"] = 0;
				MDR.TurnOn( "input_Clr" );
			}
			MDR.Display( MDR.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				MDR.x["_Ld_"] = 1;
				MDR.PullBus();
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				MDR.x["_Inc_"] = 1;
				MDR.TurnOn( "input_Inc" );
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				MDR.x["_Out_"] = 1;
				MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
				MDR.PushBus();
				MDR.TurnOn( "input_Out" );
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		// , "id_memory_Write": [ { Name:"MEMORY",				Op: ["Write"]      	}, { Name:"MDR", Op:["Out_To_Memory"]  } ]
		case "Out_To_Memory":
			if ( val === 1 ) {
console.log ( "Out_To_Memory", MAR.x._data_ );
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
console.log ( "Ld_From_Memory", MAR.x._data_ );
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
		case 'rise':			// Act-CLeanup
			MDR.rise();
		break;
		default:
			MDR.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( MDR.x["_Clr_"] === 1 ) {
			MDR.x["_data_"] = 0;
			MDR.Display( MDR.x["_data_"] );
		}
		if ( MDR.x["_Inc_"] === 1 ) {
			MDR.x["_data_"] = MDR.x["_data_"] + 1;
			MDR.Display( MDR.x["_data_"] );
		}
		if ( MDR.x["_Ld_"] === 1 ) {
			MDR.Error ( "Failed To Resolve", "Ld", 1 );
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
		MDR.x["_InputBuffer_"] = null;
		MDR.x["_Clr_"] = null;
		MDR.x["_Ld_"] = null;
		MDR.x["_Inc_"] = null;
		MDR.x["_Out_"] = null;
		MDR.x["_Ld_From_Memory_"] = null;
		MDR.x["_Out_To_Memory_"] = null;
	}

	, PullBus: function () {
console.log ( "MDR:PullBus New / Add Closure" );
		AddDep ( MDR.x.Name, [ "Bus" ], "In", function () {
console.log ( "MDR:PullBus Closure Run" );
			 	MDR.x["_InputBuffer_"] = theWorld2.Bus;
				MDR.x["_data_"] = MDR.x["_InputBuffer_"];
				MDR.Display( MDR.x["_data_"]);
				MDR.TurnOn( "input_Ld"  );
				MDR.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "MDR:PushBus New/Out:", MDR.x._OutputBuffer_ );		
		AddMsg ( MDR.x.Name, "Bus", "Out", MDR.x._OutputBuffer_ );
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
		if ( errorMsg ) {
			MDR.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MDR.x._Error );
	}

};

