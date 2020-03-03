

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
				MICROCODE_PC.PullBus();
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

	, PullBus: function () {
console.log ( "MICROCODE_PC:PullBus New / Add Closure" );
		AddDep ( MICROCODE_PC.x.Name, [ "Microcode_Ld" ], "In", function () {
console.log ( "MICROCODE_PC:PullBus Closure Run" );
			 	MICROCODE_PC.x["_InputBuffer_"] = theWorld2.Bus;
				MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"];
				MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
				MICROCODE_PC.TurnOn( "microcode_pc_Ld"  );
				MICROCODE_PC.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "MICROCODE_PC:PushBus New/Out:", MICROCODE_PC.x._OutputBuffer_ );		
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

//OLD
//OLD// MICROCODE_PC Register 
//OLD// ========
//OLD
//OLDvar MICROCODE_PC_old = {
//OLD	setupSelf: function ( ) {
//OLD		console.log ( "Setup Self/MICROCODE_PC" );
//OLD	}
//OLD	, "x": {
//OLD		  "Name": "MICROCODE_PC"
//OLD		, "_data_": 0
//OLD		, "_InputBuffer_": 0
//OLD		, "_OutputBuffer_": 0
//OLD		, "_Clr_": null , "_Ld_": null
//OLD		, "_Inc_": null
//OLD		, "_Out_": null
//OLD	}
//OLD	, msg: function ( wire, val ) {
//OLD		switch ( wire ) {
//OLD		case "Clr":
//OLD			if ( val === 1 ) {
//OLD				MICROCODE_PC.x["_Clr_"] = 1;
//OLDconsole.log ( "++++++++++ MSG Microcode PC CLR !!! ++++++++++" );
//OLD				MICROCODE_PC.x["_data_"] = 0;
//OLD				MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD				MICROCODE_PC.TurnOn( "microcode_pc_Clr" );
//OLD			}
//OLD			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
//OLD		break;
//OLD		case "Ld": 
//OLD			if ( val === 1 ) {
//OLD				MICROCODE_PC.x["_Ld_"] = 1;
//OLD				MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"];
//OLDconsole.log ( "++++++++++ Msg Microcode PC LOAD !!! ++++++++++", MICROCODE_PC.x["_data_"] );
//OLD				MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD				MICROCODE_PC.TurnOn( "microcode_pc_Ld"  );
//OLD			}
//OLD			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]);
//OLD			MICROCODE_PC.x["_Ld_"] = 1; 	
//OLD		break;
//OLD		case "Inc":
//OLD			if ( val === 1 ) {
//OLD				MICROCODE_PC.x["_Inc_"] = 1;
//OLD				MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD				MICROCODE_PC.TurnOn( "microcode_pc_Inc" );
//OLD			}	    				
//OLD			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 											
//OLD		break;
//OLD		case "Out":
//OLD			if ( val === 1 ) {
//OLD				MICROCODE_PC.x["_Out_"] = 1;
//OLD				MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD				MICROCODE_PC.TurnOn( "microcode_pc_Out" );
//OLD			}
//OLD			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 								
//OLD		break;
//OLD		default:
//OLD			Error ( "Invalid Message", wire, val );
//OLD		}
//OLD	}
//OLD	, tick: function ( ) {
//OLD		if ( MICROCODE_PC.x["_Ld_"] === 1 ) {
//OLD			MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_InputBuffer_"];
//OLDconsole.log ( "++++++++++ Tick Microcode PC LOAD !!! ++++++++++", MICROCODE_PC.x["_data_"] );
//OLD		}
//OLD		if ( MICROCODE_PC.x["_Clr_"] === 1 ) {
//OLD			MICROCODE_PC.x["_data_"] = 0;
//OLDconsole.log ( "++++++++++ Tick of Microcode PC CLR !!! ++++++++++", MICROCODE_PC.x["_data_"] );
//OLD			MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD		}
//OLD		if ( MICROCODE_PC.x["_Out_"] === 1 ) {
//OLD			MICROCODE_PC.x["_OutputBuffer_"] = MICROCODE_PC.x["_data_"];
//OLD		}
//OLD		MICROCODE_PC.Display( MICROCODE_PC.x["_data_"] );
//OLD	}
//OLD	// After Tick Cleanup 
//OLD	, rise: function ( ) {
//OLD		if ( MICROCODE_PC.x["_Inc_"] === 1 ) {
//OLDconsole.log ( "++++++++++ !!!! Rise !!!! Inc of Microcode PC ++++++++++" );
//OLD			MICROCODE_PC.x["_data_"] = MICROCODE_PC.x["_data_"] + 1;
//OLD			MICROCODE_PC.Display( MICROCODE_PC.x["_data_"]); 											
//OLD		}
//OLD		MICROCODE_PC.x["_InputBuffer_"] = null;
//OLD		MICROCODE_PC.x["_Clr_"] = null;
//OLD		MICROCODE_PC.x["_Ld_"] = null;
//OLD		MICROCODE_PC.x["_Inc_"] = null;
//OLD		MICROCODE_PC.x["_Out_"] = null;
//OLD	}
//OLD	, err: function () {
//OLD		return Error();
//OLD	}
//OLD	, test_peek: function() {
//OLD		return ( MICROCODE_PC.x["_data_"] );
//OLD	}
//OLD
//OLD	// Turn on display of a wire with this ID
//OLD	, TurnOn: function  ( id ) {
//OLD		infoOn1 ( -1, "id_"+id );
//OLD	}
//OLD
//OLD	// Display text to inside of register box
//OLD	, Display: function  ( val ) {
//OLD		var sVal = toHex(val,2);
//OLD		$("#h_microcode_pc_txt_0").text(sVal);
//OLD	}
//OLD
//OLD	// Return any errors generated in this "chip"
//OLD	, Error: function  ( errorMsg, wire, val ) {
//OLD		return ( [] );
//OLD	}
//OLD
//OLD};
