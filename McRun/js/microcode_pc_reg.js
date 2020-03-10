

// MICROCODE_PC Register (new)
// ========

var MICROCODE_PC = {
	  "x": {
		  "Name": "MICROCODE_PC"
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
				MICROCODE_PC.x["_Clr_"] = 1;
				MICROCODE_PC.x["_data_"] = 0;
				MICROCODE_PC.TurnOn( "microcode_pc_Clr" );
			}
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				MICROCODE_PC.x["_Ld_"] = 1;
				MICROCODE_PC.PullFromMux();
			}
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				MICROCODE_PC.x["_Inc_"] = 1;
				MICROCODE_PC.TurnOn( "microcode_pc_Inc" );
			}
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				MICROCODE_PC.x["_Out_"] = 1;
				MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
				MICROCODE_PC.PushBus();
				MICROCODE_PC.TurnOn( "microcode_pc_Out" );
			}
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			MICROCODE_PC.rise();
		break;
		default:
			MICROCODE_PC.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( MICROCODE_PC.x["_Clr_"] === 1 ) {
			MICROCODE_PC.x["_data_"] = 0;
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"] );
		}
		if ( MICROCODE_PC.x["_Inc_"] === 1 ) {
			MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_data_"] + 1;
			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"] );
		}
		if ( MICROCODE_PC.x["_Ld_"] === 1 ) {
			MICROCODE_PC.Error ( "Failed To Resolve", "Ld", 1 );
		}
		MICROCODE_PC.x["_InputBuffer_"] = null;
		MICROCODE_PC.x["_Clr_"] = null;
		MICROCODE_PC.x["_Ld_"] = null;
		MICROCODE_PC.x["_Inc_"] = null;
		MICROCODE_PC.x["_Out_"] = null;
	}

	, PullFromMux: function () {
// console.log ( "MICROCODE_PC:PullFromMux New / Add Closure" );
		AddDep ( MICROCODE_PC.x.Name, [ "Microcode_Ld" ], "In", function () {
// console.log ( "MICROCODE_PC:PullFromMux Closure Run", MUX.x._Out_ );
			 	MICROCODE_PC.x["_InputBuffer_"] = MUX.x._Out_;
				MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"];
				MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
				MICROCODE_PC.TurnOn( "microcode_pc_Ld"  );
				MICROCODE_PC.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
// console.log ( "MICROCODE_PC:PushBus New/Out:", MICROCODE_PC.x._OutputBuffer_ );		
		AddMsg ( MICROCODE_PC.x.Name, "Microcode_PC_Addr", "Out", MICROCODE_PC.x._OutputBuffer_ );
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,2);
		$("#h_microcode_pc_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MICROCODE_PC.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MICROCODE_PC.x._Error );
	}

};

