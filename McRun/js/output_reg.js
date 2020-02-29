
// OUTPUT Register (new)
// ========

//			<g id="dig0_0_7seg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">
//			<g id="dig1_0_7seg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">
//			<g id="dig2_0_7seg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">
//			<g id="dig3_0_7seg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">

// Set 7-seg display to notning - no LEDs on.
function clear7seg () {
	// <g id="dig0___7seg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">
	for ( var ii = 0; ii < 4; ii++ ) {
		for ( jj = 0; jj <= 9; jj++ ) {
			var id = "#dig"+ii+"_"+jj+"_7seg";
			$(id).hide();
		}
		var id = "#dig"+ii+"___7seg";
		$(id).show();
	}
}

function zero7seg () {
	for ( var ii = 0; ii < 4; ii++ ) {
		for ( jj = 0; jj <= 9; jj++ ) {
			var id = "#dig"+ii+"_"+jj+"_7seg";
			$(id).hide();
		}
		var id = "#dig"+ii+"___7seg";
		$(id).hide();
		var id = "#dig"+ii+"_0_7seg";
		$(id).show();
	}
}


// Set 7-seg display to show 'v'
function show7seg ( v ) {
	var sVar = toHex(v,4);
	var a = sVar.substr(0,1);	// MSB
	var b = sVar.substr(1,1);
	var c = sVar.substr(2,1);
	var d = sVar.substr(3,1);	// LSB
	var x = [ a, b, c, d ];
console.log ( "x=", x );

	for ( var ii = 0; ii < 4; ii++ ) {
		for ( jj = 0; jj <= 9; jj++ ) {
			var id = "#dig"+ii+"_"+jj+"_7seg";
			$(id).hide();
		}
		var id = "#dig"+ii+"___7seg";
		$(id).hide();
		var id = "#dig"+ii+"_"+x[ii]+"_7seg";
		$(id).show();
	}
}


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
		show7seg ( val );
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			OUTPUT.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( OUTPUT.x._Error );
	}

};

