
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
				MDR.TurnOn( "mdr_Clr" );
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
				MDR.TurnOn( "mdr_Inc" );
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				MDR.x["_Out_"] = 1;
				MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
				MDR.PushBus();
				// MDR.TurnOn( "mdr_Out" );
				MDR.TurnOn( "mdr_Out" );									// .///////////////////////////////////////// defect "input"
			}
			MDR.Display( MDR.x["_data_"]);
		break;
		// , "id_memory_Write": [ { Name:"MEMORY",				Op: ["Write"]      	}, { Name:"MDR", Op:["From_MDR_to_Memory"]  } ]
		case "From_MDR_to_Memory":		// Write to Memory
			if ( val === 1 ) {
console.log ( "From_MDR_to_Memory", MAR.x._data_ );
				MDR.x["_Out_To_Memory_"] = 1;
				MDR.x["_OutputBuffer_"] = MDR.x["_data_"];
				// xyzzy - Push Message
				// MDR.PushBus();
				AddMsg ( MDR.x.Name, "MDR_to_Memory", "Out", MDR.x._OutputBuffer_ );
				MDR.TurnOn( "From_MDR_to_Memory" );
				// AddMsg ( MDR.x.Name, "Memory_to_MDR", "Out", MDR.x._OutputBuffer_ );
			}
			MDR.Display( MDR.x["_data_"]); 						
		break;
		// , "id_memory_Read": [ { Name:"MEMORY",				Op: ["Read"]      	}, { Name:"MDR", Op:["From_Memory_to_MDR"] } ]
		case "From_Memory_to_MDR": 	// Reaa From Memory
		case "Memory_to_MDR": 	// Reaa From Memory
			if ( val === 1 ) {
console.log ( "From_Memory_to_MDR", MAR.x._data_ );
				MDR.x["_Ld_From_Memory_"] = 1;
				MDR.PullMemory();
				MDR.TurnOn( "From_Memory_to_MDR" );
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
		}
		if ( MDR.x["_Ld_From_Memory_"] === 1 ) {
			MDR.x["_InputBuffer_"] = MEMORY.x._OutputBuffer_;
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
		AddDep ( MDR.x.Name, [ "Bus" ], "Out", function () {
console.log ( "MDR:PullBus Closure Run" );
			 	MDR.x["_InputBuffer_"] = theWorld2.Bus;
				MDR.x["_data_"] = MDR.x["_InputBuffer_"];
				MDR.Display( MDR.x["_data_"]);
				MDR.TurnOn( "mdr_Ld"  );
				MDR.x["_Ld_"] = 2;
		});													
	}

	, PullMemory: function () {
console.log ( "MDR:PullMemory New / Add Closure" );
		AddDep ( MDR.x.Name, [ "Bus" ], "Out", function () {
console.log ( "MDR:PullMemory Closure Run" );
			 	MDR.x["_InputBuffer_"] = theWorld2.Memory_to_MDR;
				MDR.x["_data_"] = MDR.x["_InputBuffer_"];
				MDR.Display( MDR.x["_data_"]);
				// MDR.TurnOn( "mdr_Ld"  );
				MDR.x["_Ld_From_Memory_"] = 2;
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

