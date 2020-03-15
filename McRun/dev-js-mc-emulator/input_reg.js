

// INPUT Register (new)
// ========

var INPUT = {
	  "x": {
		  "Name": "INPUT"
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
				INPUT.x["_Clr_"] = 1;
				INPUT.x["_data_"] = 0;
				INPUT.TurnOn( "input_Clr" );
			}
			INPUT.Display( INPUT.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				INPUT.x["_Ld_"] = 1;
				INPUT.PullBus();
				// INPUT.x["_data_"] = INPUT.x["_InputBuffer_"];
				// INPUT.TurnOn( "input_Ld" );
			}
			INPUT.Display( INPUT.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				INPUT.x["_Inc_"] = 1;
				INPUT.TurnOn( "input_Inc" );
			}
			INPUT.Display( INPUT.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				INPUT.x["_Out_"] = 1;
				INPUT.x["_OutputBuffer_"] = INPUT.x["_data_"];
				INPUT.PushBus();
				INPUT.TurnOn( "input_Out" );
			}
			INPUT.Display( INPUT.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			INPUT.rise();
		break;
		default:
			INPUT.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( INPUT.x["_Clr_"] === 1 ) {
			INPUT.x["_data_"] = 0;
			INPUT.Display( INPUT.x["_data_"] );
		}
		if ( INPUT.x["_Inc_"] === 1 ) {
			INPUT.x["_data_"] = INPUT.x["_data_"] + 1;
			INPUT.Display( INPUT.x["_data_"] );
		}
		if ( INPUT.x["_Ld_"] === 1 ) {
			INPUT.Error ( "Failed To Resolve", "Ld", 1 );
		}
		INPUT.x["_InputBuffer_"] = null;
		INPUT.x["_Clr_"] = null;
		INPUT.x["_Ld_"] = null;
		INPUT.x["_Inc_"] = null;
		INPUT.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "INPUT:PullBus New / Add Closure" );
		AddDep ( INPUT.x.Name, [ "Bus" ], "In", function () {
console.log ( "INPUT:PullBus Closure Run" );
				if ( theWorld2["do_input"] ) {
					INPUT.x["_InputBuffer_"] = GetInput();
				} else {
					INPUT.x["_InputBuffer_"] = theWorld2.Bus;
				}
				INPUT.x["_data_"] = INPUT.x["_InputBuffer_"];
				INPUT.Display( INPUT.x["_data_"]);
				INPUT.TurnOn( "input_Ld"  );
				INPUT.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "INPUT:PushBus New/Out:", INPUT.x._OutputBuffer_ );		
		AddMsg ( INPUT.x.Name, "Bus", "Out", INPUT.x._OutputBuffer_ );
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		$("#h_input_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			INPUT.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( INPUT.x._Error );
	}

};

