
// AC Register (new)
// ========

var AC = {
	  "x": {
		  "Name": "AC"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Clr_": null
		, "_Ld_": null
		, "_Inc_": null
		, "_Out_": null
		, "_Out_to_ALU_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Clr":				// Act
			if ( val === 1 ) {
				AC.x["_Clr_"] = 1;
				AC.x["_data_"] = 0;
				AC.TurnOn( "ac_Clr" );
			}
			AC.Display( AC.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				AC.x["_Ld_"] = 1;
				AC.PullBus();
			}
			AC.Display( AC.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				AC.x["_Inc_"] = 1;
				AC.TurnOn( "ac_Inc" );
			}
			AC.Display( AC.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				AC.x["_Out_"] = 1;
				AC.x["_OutputBuffer_"] = AC.x["_data_"];
				AC.PushBus();
				AC.TurnOn( "ac_Out" );
			}
			AC.Display( AC.x["_data_"]);
		break;
		case "Out_to_ALU":
			if ( val === 1 ) {
				AC.x["_ALUOutputBuffer_"] = AC.x["_data_"];
				AC.PushBus();
			  	AC.TurnOn( "ac_Out_to_ALU" );
			}
			AC.Display( AC.x["_data_"]);
			break;
		case 'rise':			// Act-CLeanup
			AC.rise();
		break;
		default:
			AC.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( AC.x["_Clr_"] === 1 ) {
			AC.x["_data_"] = 0;
			AC.Display( AC.x["_data_"] );
		}
		if ( AC.x["_Inc_"] === 1 ) {
			AC.x["_data_"] = AC.x["_data_"] + 1;
			AC.Display( AC.x["_data_"] );
		}
		if ( AC.x["_Ld_"] === 1 ) {
			AC.Error ( "Failed To Resolve", "Ld", 1 );
		}
		AC.x["_InputBuffer_"] = null;
		AC.x["_Clr_"] = null;
		AC.x["_Ld_"] = null;
		AC.x["_Inc_"] = null;
		AC.x["_Out_"] = null;
		AC.x["_Out_to_ALU_"] = null;
	}

	, PullBus: function () {
console.log ( "AC:PullBus New / Add Closure" );
		AddDep ( AC.x.Name, [ "Bus" ], "In", function () {
console.log ( "AC:PullBus Closure Run" );
			 	AC.x["_InputBuffer_"] = theWorld2.Bus;
				AC.x["_data_"] = AC.x["_InputBuffer_"];
				AC.Display( AC.x["_data_"]);
				AC.TurnOn( "ac_Ld"  );
				AC.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "AC:PushBus New/Out:", AC.x._OutputBuffer_ );		
		AddMsg ( AC.x.Name, "Bus", "Out", AC.x._OutputBuffer_ );
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		var a = sVal.substr(0,2);
		var b = sVal.substr(2,2);
		$("#h_ac_txt_0").text(a);
		$("#h_ac_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			AC.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( AC.x._Error );
	}

};

