
// MAR Register  (new)
// ========

var MAR = {
	  "x": {
		  "Name": "MAR"
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
				MAR.x["_Clr_"] = 1;
				MAR.x["_data_"] = 0;
				MAR.TurnOn( "mar_Clr" );
			}
			MAR.Display( MAR.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				MAR.x["_Ld_"] = 1;
				MAR.PullBus();
			}
			MAR.Display( MAR.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				MAR.x["_Inc_"] = 1;
				MAR.TurnOn( "mar_Inc" );
			}
			MAR.Display( MAR.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				MAR.x["_Out_"] = 1;
				MAR.x["_OutputBuffer_"] = MAR.x["_data_"];
				MAR.PushBus();
				MAR.TurnOn( "mar_Out" );
			}
			MAR.Display( MAR.x["_data_"]);
		break;
		case "Out_to_Memory":		
			if ( val === 1 ) {
				MAR.x["_Out_"] = 1;
				MAR.x["_OutputBuffer_"] = MAR.x["_data_"];
				AddMsg ( MAR.x.Name, "Memory_Addr", "Out", MAR.x._OutputBuffer_ );		
				MAR.TurnOn( "mar_Out_to_Memory" );
			}
			MAR.Display( MAR.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			MAR.rise();
		break;
		default:
			MAR.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( MAR.x["_Clr_"] === 1 ) {
			MAR.x["_data_"] = 0;
			MAR.Display( MAR.x["_data_"] );
		}
		if ( MAR.x["_Inc_"] === 1 ) {
			MAR.x["_data_"] = MAR.x["_data_"] + 1;
			MAR.Display( MAR.x["_data_"] );
		}
		if ( MAR.x["_Ld_"] === 1 ) {
			MAR.Error ( "Failed To Resolve", "Ld", 1 );
		}
		MAR.x["_InputBuffer_"] = null;
		MAR.x["_Clr_"] = null;
		MAR.x["_Ld_"] = null;
		MAR.x["_Inc_"] = null;
		MAR.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "MAR:PullBus New / Add Closure" );
		AddDep ( MAR.x.Name, [ "Bus" ], "In", function () {
console.log ( "MAR:PullBus Closure Run" );
			 	MAR.x["_InputBuffer_"] = theWorld2.Bus;
				MAR.x["_data_"] = MAR.x["_InputBuffer_"];
				MAR.Display( MAR.x["_data_"]); 						
				MAR.TurnOn( "mar_Ld"  );
				MAR.x["_Ld_"] = 2;
		} );					
	}

	, PushBus: function () {
console.log ( "!!! MAR:PushBus New/Out:", MAR.x._OutputBuffer_ );		
		AddMsg ( MAR.x.Name, "Bus", "Out", MAR.x._OutputBuffer_ );		
		AddMsg ( MAR.x.Name, "Memory_Addr", "Out", MAR.x._OutputBuffer_ );		
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		$("#h_mar_txt_0").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MAR.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MAR.x._Error );
	}

};

