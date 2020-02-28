
// PC Register 
// ========

var PC = {
	  "x": {
		  "Name": "PC"
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
				PC.x["_Clr_"] = 1;
				PC.x["_data_"] = 0;
				PC.TurnOn( "pc_Clr" );
			}
			PC.Display( PC.x["_data_"]); 						
		break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				PC.x["_Ld_"] = 1;
				PC.PullBus();
				// PC.x["_data_"] = PC.x["_InputBuffer_"];
				// PC.TurnOn( "pc_Ld" );
			}
			PC.Display( PC.x["_data_"]);
		break;
		case "Inc":				// Act
			if ( val === 1 ) {
				PC.x["_Inc_"] = 1;
				PC.TurnOn( "pc_Inc" );
			}
			PC.Display( PC.x["_data_"]);
		break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				PC.x["_Out_"] = 1;
				PC.x["_OutputBuffer_"] = PC.x["_data_"];
				PC.PushBus();
				PC.TurnOn( "pc_Out" );
			}
			PC.Display( PC.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			PC.rise();
		break;
		default:
			PC.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( PC.x["_Clr_"] === 1 ) {
			PC.x["_data_"] = 0;
			PC.Display( PC.x["_data_"] );
		}
		if ( PC.x["_Inc_"] === 1 ) {
			PC.x["_data_"] = PC.x["_data_"] + 1;
			PC.Display( PC.x["_data_"] );
		}
		if ( PC.x["_Ld_"] === 1 ) {
			PC.Error ( "Failed To Resolve", "Ld", 1 );
		}
		PC.x["_InputBuffer_"] = null;
		PC.x["_Clr_"] = null;
		PC.x["_Ld_"] = null;
		PC.x["_Inc_"] = null;
		PC.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "PC:PullBus New" );
		AddDep ( PC.x.Name, [ "Bus" ], "In", function () {
console.log ( "PC:PullBus Closure Added" );
			 	PC.x["_InputBuffer_"] = theWorld2.Bus;
				PC.x["_data_"] = PC.x["_InputBuffer_"];
				PC.TurnOn( "pc_Ld"  );
				PC.x["_Ld_"] = 2;
		} );														// Resovles Bus							<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
//			 PC.x["_InputBuffer_"] = theWorld.Bus.State();
//console.log ( "PC:PullBus", PC.x["_InputBuffer_"] );
//		}
	}

	, PushBus: function () {
console.log ( "PC:PushBus New:", PC.x._OutputBuffer_ );		
		AddMsg ( PC.x.Name, "Bus", "Out", PC.x._OutputBuffer_ );		// Resovles Bus							<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
//console.log ( "PC:PushBus", PC.x["_OutputBuffer_"] );
//			theWorld.Bus.SetState( PC.x["_OutputBuffer_"] );
//		}
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
		$("#h_pc_txt_0").text(a);
		$("#h_pc_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			PC.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( PC.x._Error );
	}

};

