

// OUTPUT Register (new)
// ========

var OUTPUT = {
	  "x": {
		  "Name": "OUTPUT"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		//, "_Clr_": null
		, "_Ld_": null
		//, "_Inc_": null
		, "_Out_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		switch ( wire ) {
		//case "Clr":				// Act
		//	if ( val === 1 ) {
		//		OUTPUT.x["_Clr_"] = 1;
		//		OUTPUT.x["_data_"] = 0;
		//		OUTPUT.TurnOn( "output_Clr" );
		//	}
		//	OUTPUT.Display( OUTPUT.x["_data_"]); 						
		//break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				OUTPUT.x["_Ld_"] = 1;
				OUTPUT.PullBus();
				// OUTPUT.x["_data_"] = OUTPUT.x["_InputBuffer_"];
				// OUTPUT.TurnOn( "output_Ld" );
			}
			OUTPUT.Display( OUTPUT.x["_data_"]);
		break;
		//case "Inc":				// Act
		//	if ( val === 1 ) {
		//		OUTPUT.x["_Inc_"] = 1;
		//		OUTPUT.TurnOn( "output_Inc" );
		//	}
		//	OUTPUT.Display( OUTPUT.x["_data_"]);
		//break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				OUTPUT.x["_Out_"] = 1;
				OUTPUT.x["_OutputBuffer_"] = OUTPUT.x["_data_"];
				OUTPUT.PushBus();
				OUTPUT.TurnOn( "output_Out" );
			}
			OUTPUT.Display( OUTPUT.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			OUTPUT.rise();
		break;
		default:
			OUTPUT.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		//if ( OUTPUT.x["_Clr_"] === 1 ) {
		//	OUTPUT.x["_data_"] = 0;
		//	OUTPUT.Display( OUTPUT.x["_data_"] );
		//}
		//if ( OUTPUT.x["_Inc_"] === 1 ) {
		//	OUTPUT.x["_data_"] = OUTPUT.x["_data_"] + 1;
		//	OUTPUT.Display( OUTPUT.x["_data_"] );
		//}
		if ( OUTPUT.x["_Ld_"] === 1 ) {
			OUTPUT.Error ( "Failed To Resolve", "Ld", 1 );
		}
		OUTPUT.x["_InputBuffer_"] = null;
		//OUTPUT.x["_Clr_"] = null;
		OUTPUT.x["_Ld_"] = null;
		//OUTPUT.x["_Inc_"] = null;
		OUTPUT.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "OUTPUT:PullBus New / Add Closure" );
		AddDep ( OUTPUT.x.Name, [ "Bus" ], "In", function () {
console.log ( "OUTPUT:PullBus Closure Run" );
			 	OUTPUT.x["_InputBuffer_"] = theWorld2.Bus;
				OUTPUT.x["_data_"] = OUTPUT.x["_InputBuffer_"];
				OUTPUT.Display( OUTPUT.x["_data_"]);
				OUTPUT.TurnOn( "output_Ld"  );
				OUTPUT.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "OUTPUT:PushBus New/Out:", OUTPUT.x._OutputBuffer_ );		
		AddMsg ( OUTPUT.x.Name, "Bus", "Out", OUTPUT.x._OutputBuffer_ );
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		$("#h_output_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			OUTPUT.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( OUTPUT.x._Error );
	}

};

