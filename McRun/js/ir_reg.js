
// IR Register 
// ========

var IR_old = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/IR" );
	}
	, "x": {
		  "Name": "IR"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Ld_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ld": 
			if ( val === 1 ) {
				IR.x["_Ld_"] = 1;
				IR.PullBus();
				IR.x["_data_"] = IR.x["_InputBuffer_"];
				IR.TurnOn( "ir_Ld"  );
			}
			IR.Display( IR.x["_data_"]);
		break;
		case "Out":
			if ( val === 1 ) {
				IR.x["_Out_"] = 1;
				IR.x["_OutputBuffer_"] = IR.x["_data_"];
				IR.PushBus();
				IR.TurnOn( "ir_Out" );
			} 
			IR.Display( IR.x["_data_"]);
		break;
		default:
			IR.Error ( "Invalid Message", wire, val );
		break;
		}
	}
	, tick: function ( ) {
		if ( IR.x["_Ld_"] === 1 ) {
			IR.PullBus();
			IR.x["_data_"] = IR.x["_InputBuffer_"];
		}
		if ( IR.x["_Out_"] === 1 ) {
			IR.x["_OutputBuffer_"] = IR.x["_data_"];
			IR.PushBus();
		}
		IR.Display( IR.x["_data_"] );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		IR.x["_InputBuffer_"] = null;
		IR.x["_Ld_"] = null;
		IR.x["_Out_"] = null;
	}
	, err: function () {
		return IR.Error();
	}
	, test_peek: function() {
		return ( IR.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 IR.x["_InputBuffer_"] = theWorld.Bus.State();
		}
	}

	, PushBus: function () {
		if ( IR.debug01 ) {
			console.log ( "IR:PushBus [][][][]", IR.x["_OutputBuffer_"] );
			console.log ( "  IR:PushBus [][][][]", IR.x["_OutputBuffer_"] );
			console.log ( "    IR:PushBus [][][][]", IR.x["_OutputBuffer_"] );
			console.log ( "      IR:PushBus [][][][]", IR.x["_OutputBuffer_"] );
		}
		if(theWorld.Bus && typeof theWorld.Bus.SetState === "function") {
			if ( theWorld.hand_out && theWorld.hand_out._data_ === 1 ) {
console.log ( "IR:PushBus/hand_out [][][][]", IR.x["_OutputBuffer_"] );
				theWorld.Bus.SetState( ( IR.x["_OutputBuffer_"] & 0x0fff ) );
			} else {
console.log ( "IR:PushBus", IR.x["_OutputBuffer_"] );
				theWorld.Bus.SetState( IR.x["_OutputBuffer_"] );
			}
		}

		var ir = IR.x["_data_"];
		var irA = ( ir & 0xf000 ) >> 12;
		var irB = ( ir & 0x0f00 ) >> 8;

		if ( IR.debug01 ) {
			console.log ( "irA", irA.toString(16) );
			console.log ( "irB", irB.toString(16) );
			console.log ( "11_6", ( (irA & 0x8) != 0 ) ? 1 : 0 );
			console.log ( "11_5", ( (irA & 0x4) != 0 ) ? 1 : 0 );
			console.log ( "11_4", ( (irA & 0x2) != 0 ) ? 1 : 0 );
			console.log ( "11_3", ( (irA & 0x1) != 0 ) ? 1 : 0 ); 
		}

		MUX.msg("11_6", ( (irA & 0x8) != 0 ) ? 1 : 0 );
		MUX.msg("11_5", ( (irA & 0x4) != 0 ) ? 1 : 0 );
		MUX.msg("11_4", ( (irA & 0x2) != 0 ) ? 1 : 0 );
		MUX.msg("11_3", ( (irA & 0x1) != 0 ) ? 1 : 0 );

		MUX.msg("10_5", ( (irB & 0x8) != 0 ) ? 1 : 0 );
		MUX.msg("10_4", ( (irB & 0x4) != 0 ) ? 1 : 0 );
		MUX.msg("10_3", ( (irB & 0x2) != 0 ) ? 1 : 0 );
		MUX.msg("10_2", ( (irB & 0x1) != 0 ) ? 1 : 0 );

//	, "McJmp_7": { Name: "MUX", 					Op: ["00_7","01_7","10_7","11_7"] }
//	, "McJmp_6": { Name: "MUX", 					Op: ["00_6","01_6","10_6"       ] }
//	, "McJmp_5": { Name: "MUX", 					Op: ["00_5","01_5"              ] }
//	, "McJmp_4": { Name: "MUX", 					Op: ["00_4","01_4"              ] }
//	, "McJmp_3": { Name: "MUX", 					Op: ["00_3","01_3"              ] }
//	, "McJmp_2": { Name: "MUX", 					Op: ["00_2","01_2"       ,"11_2"] }	
//	, "McJmp_1": { Name: "MUX", 					Op: ["00_1"       ,"10_1","11_1"] }
//	, "McJmp_0": { Name: "MUX", 					Op: ["00_0","01_0","10_0","11_0"] }

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
		$("#h_ir_txt_0").text(a);
		$("#h_ir_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};


// IR Register (new)
// ========

var IR = {
	  "x": {
		  "Name": "IR"
		, "_data_": 0
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		// , "_Clr_": null
		, "_Ld_": null
		// , "_Inc_": null
		, "_Out_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		switch ( wire ) {
		//case "Clr":				// Act
		//	if ( val === 1 ) {
		//		IR.x["_Clr_"] = 1;
		//		IR.x["_data_"] = 0;
		//		IR.TurnOn( "ir_Clr" );
		//	}
		//	IR.Display( IR.x["_data_"]); 						
		//break;
		case "Ld": 				// In, DepOn Bus
			if ( val === 1 ) {
				IR.x["_Ld_"] = 1;
				IR.PullBus();
			}
			IR.Display( IR.x["_data_"]);
		break;
		//case "Inc":				// Act
		//	if ( val === 1 ) {
		//		IR.x["_Inc_"] = 1;
		//		IR.TurnOn( "ir_Inc" );
		//	}
		//	IR.Display( IR.x["_data_"]);
		//break;
		case "Out":				// Resolves Bus
			if ( val === 1 ) {
				IR.x["_Out_"] = 1;
				IR.x["_OutputBuffer_"] = IR.x["_data_"];
				IR.PushBus();
				IR.TurnOn( "ir_Out" );
			}
			IR.Display( IR.x["_data_"]);
		break;
		case 'rise':			// Act-CLeanup
			IR.rise();
		break;
		default:
			IR.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		//if ( IR.x["_Clr_"] === 1 ) {
		//	IR.x["_data_"] = 0;
		//	IR.Display( IR.x["_data_"] );
		//}
		//if ( IR.x["_Inc_"] === 1 ) {
		//	IR.x["_data_"] = IR.x["_data_"] + 1;
		//	IR.Display( IR.x["_data_"] );
		//}
		if ( IR.x["_Ld_"] === 1 ) {
			IR.Error ( "Failed To Resolve", "Ld", 1 );
		}
		IR.x["_InputBuffer_"] = null;
		IR.x["_Clr_"] = null;
		IR.x["_Ld_"] = null;
		IR.x["_Inc_"] = null;
		IR.x["_Out_"] = null;
	}

	, PullBus: function () {
console.log ( "IR:PullBus New / Add Closure" );
		AddDep ( IR.x.Name, [ "Bus" ], "In", function () {
console.log ( "IR:PullBus Closure Run" );
			 	IR.x["_InputBuffer_"] = theWorld2.Bus;
				IR.x["_data_"] = IR.x["_InputBuffer_"];
				IR.Display( IR.x["_data_"]);
				IR.TurnOn( "ir_Ld"  );
				IR.x["_Ld_"] = 2;
		});													
	}

	, PushBus: function () {
console.log ( "IR:PushBus New/Out:", IR.x._OutputBuffer_ );		
		AddMsg ( IR.x.Name, "Bus", "Out", IR.x._OutputBuffer_ );

		var ir = IR.x["_data_"];
		var irA = ( ir & 0xf000 ) >> 12;
		var irB = ( ir & 0x0f00 ) >> 8;

		if ( IR.debug01 ) {
			console.log ( "irA", irA.toString(16) );
			console.log ( "irB", irB.toString(16) );
			console.log ( "11_6", ( (irA & 0x8) != 0 ) ? 1 : 0 );
			console.log ( "11_5", ( (irA & 0x4) != 0 ) ? 1 : 0 );
			console.log ( "11_4", ( (irA & 0x2) != 0 ) ? 1 : 0 );
			console.log ( "11_3", ( (irA & 0x1) != 0 ) ? 1 : 0 ); 
		}

		MUX.msg("11_6", ( (irA & 0x8) != 0 ) ? 1 : 0 );
		MUX.msg("11_5", ( (irA & 0x4) != 0 ) ? 1 : 0 );
		MUX.msg("11_4", ( (irA & 0x2) != 0 ) ? 1 : 0 );
		MUX.msg("11_3", ( (irA & 0x1) != 0 ) ? 1 : 0 );

		MUX.msg("10_5", ( (irB & 0x8) != 0 ) ? 1 : 0 );
		MUX.msg("10_4", ( (irB & 0x4) != 0 ) ? 1 : 0 );
		MUX.msg("10_3", ( (irB & 0x2) != 0 ) ? 1 : 0 );
		MUX.msg("10_2", ( (irB & 0x1) != 0 ) ? 1 : 0 );

//	, "McJmp_7": { Name: "MUX", 					Op: ["00_7","01_7","10_7","11_7"] }
//	, "McJmp_6": { Name: "MUX", 					Op: ["00_6","01_6","10_6"       ] }
//	, "McJmp_5": { Name: "MUX", 					Op: ["00_5","01_5"              ] }
//	, "McJmp_4": { Name: "MUX", 					Op: ["00_4","01_4"              ] }
//	, "McJmp_3": { Name: "MUX", 					Op: ["00_3","01_3"              ] }
//	, "McJmp_2": { Name: "MUX", 					Op: ["00_2","01_2"       ,"11_2"] }	
//	, "McJmp_1": { Name: "MUX", 					Op: ["00_1"       ,"10_1","11_1"] }
//	, "McJmp_0": { Name: "MUX", 					Op: ["00_0","01_0","10_0","11_0"] }

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
		$("#h_ir_txt_0").text(a);
		$("#h_ir_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			IR.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( IR.x._Error );
	}

};

