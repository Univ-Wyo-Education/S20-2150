
// RESULT Register (new)
// ========

var RESULT = {
	  "x": {
		  "Name": "RESULT"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
//		, "_Inc_": null
		, "_Out_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr":				// Act
			if ( val === 1 ) {
				RESULT.x["_Clr_"] = 1;
				RESULT.x["_data_"] = 0;
				RESULT.TurnOn( "result_Clr" );
			}
			RESULT.Display( RESULT.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				RESULT.x["_Ld_"] = 1;
				RESULT.PullBus();
			}
			RESULT.Display( RESULT.x["_data_"]);
		break;
//		case "Inc":				// Act
//			if ( val === 1 ) {
//				RESULT.x["_Inc_"] = 1;
//				RESULT.TurnOn( "result_Inc" );
//			}
//			RESULT.Display( RESULT.x["_data_"]);
//		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				RESULT.x["_Out_"] = 1;
				RESULT.x["_OutputBuffer_"] = RESULT.x["_data_"];
				RESULT.PushBus();
				RESULT.TurnOn( "result_Out" );
			}
			RESULT.Display( RESULT.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			RESULT.rise();
		break;
		default:
			RESULT.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( RESULT.x["_Clr_"] === 1 ) {
			RESULT.x["_data_"] = 0;
			RESULT.Display( RESULT.x["_data_"] );
		}
//		if ( RESULT.x["_Inc_"] === 1 ) {
//			RESULT.x["_data_"] = RESULT.x["_data_"] + 1;
//			RESULT.Display( RESULT.x["_data_"] );
//		}
		if ( RESULT.x["_Ld_"] === 1 ) {
			RESULT.Error ( "Failed To Resolve", "Ld", 1 );
		}
		RESULT.x["_InputBuffer_"] = null;
		RESULT.x["_Clr_"] = null;
		RESULT.x["_Ld_"] = null;
//		RESULT.x["_Inc_"] = null;
		RESULT.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "RESULT:PullBus New / Add Closure" );
		AddDep ( RESULT.x.Name, [ "Bus" ], "In", function () {
				if ( theWorld2["id_ALU_Ctl"] ) {
console.error ( "RESULT:PullBus Closure Run - pulling from ALU" );
					RESULT.x["_InputBuffer_"] = ALU.x._OutputBuffer_;
					RESULT.x["_data_"] = RESULT.x["_InputBuffer_"];
					RESULT.Display( RESULT.x["_data_"]);
					RESULT.TurnOn( "result_Ld"  );
					RESULT.x["_Ld_"] = 3;
				} else {
console.error ( "RESULT:PullBus Closure Run - pulling from Bus" );
					RESULT.x["_InputBuffer_"] = theWorld2.Bus;
					RESULT.x["_data_"] = RESULT.x["_InputBuffer_"];
					RESULT.Display( RESULT.x["_data_"]);
					RESULT.TurnOn( "result_Ld"  );
					RESULT.x["_Ld_"] = 2;
				}
		});													
	}

	, PushBus: function () {
console.log ( "RESULT:PushBus New/Out:", RESULT.x._OutputBuffer_ );		
		AddMsg ( RESULT.x.Name, "Bus", "Out", RESULT.x._OutputBuffer_ );

		// IsZero Implementation - push data to the MUX/Decoder
		var dd = RESULT.x["_data_"];		// Should be _OutputBuffer_ ?
		MUX.msg("01_1", ( dd != 0 ) ? 1 : 0 );
		//	, "McJmp_7": { Name: "MUX", 					Op: ["00_7","01_7","10_7","11_7"] }
		//	, "McJmp_6": { Name: "MUX", 					Op: ["00_6","01_6","10_6"       ] }
		//	, "McJmp_5": { Name: "MUX", 					Op: ["00_5","01_5"              ] }
		//	, "McJmp_4": { Name: "MUX", 					Op: ["00_4","01_4"              ] }
		//	, "McJmp_3": { Name: "MUX", 					Op: ["00_3","01_3"              ] }
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
		$("#h_result_txt_0").text(a);
		$("#h_result_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			RESULT.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( RESULT.x._Error );
	}

};

