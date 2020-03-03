
// MUX : 8 wide, 4 inputs to 1 output mux
// ========

var MUX = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MUX" );
	}
	, "x": {
		  "Name": "MUX"
		, "_Ctl_0_": null
		, "_Ctl_1_": null
		, "_Ctl_": null
		, "_00_": null
		, "_01_": null
		, "_10_": null
		, "_11_": null
		, "_Out_": null
		, "_Error_": []
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ctl":
			val = val & 3;
			MUX.x["_Ctl_"] = val;
			MUX.x["_Ctl_0_"] = val & 1;
			MUX.x["_Ctl_1_"] = ( val & 2 ) >> 1;
		break;
		case "Ctl_0":
			MUX.x["_Ctl_0_"] = val & 1;
			MUX.x["_Ctl_"] = MUX.x["_Ctl_"] & 2 | MUX.x["_Ctl_0_"] ;
		break;
		case "Ctl_1":
			MUX.x["_Ctl_1_"] = val & 1;
			MUX.x["_Ctl_"] = MUX.x["_Ctl_"] & 1 | ( MUX.x["_Ctl_0_"] << 1 );
		break;
		default:
			// 00_x
			// 01_x
			// 10_x
			// 11_x
			var nTh = wire.substr(3,1);
			nTh = parseInt(nTh);
			var b0 = ( wire.substr(0,1) == '0' ) ? 0 : 1;	// Ctl_1
			var b1 = ( wire.substr(1,1) == '0' ) ? 0 : 1;	// Ctl_0
			var bb = (b1&0x1) << 1 | (b0&0x1);				// Ctl (as a number)
			if ( MUX.debug01 ) {
				console.log ( "  MUX: parse of 'wire'="+wire, 'nTh=', nTh, "(_Ctl_0_)b0=", b0, "(_Ctl_1_)b1=", b1, "(_Ctl_)bb=", bb, ' wire=',wire, 'set-to', val );
			}
			MUX.x["_"+wire+"_"] = val;

			var c = MUX.x["_Ctl_1_"];
			var d = MUX.x["_Ctl_0_"];
			MUX.x["_Ctl_"] = c << 1 | d;

			switch ( MUX.x["_Ctl_"] & 0x3 ) {
			case 0:
				MUX.x["_Out_"] = MUX.x["_00_"] = 
					( MUX.x["_00_0_"] & 0x1 ) 		|
					( MUX.x["_00_1_"] & 0x1 ) << 1 	|
					( MUX.x["_00_2_"] & 0x1 ) << 2 	|
					( MUX.x["_00_3_"] & 0x1 ) << 3 	|
					( MUX.x["_00_4_"] & 0x1 ) << 4 	|
					( MUX.x["_00_5_"] & 0x1 ) << 5 	|
					( MUX.x["_00_6_"] & 0x1 ) << 6 	|
					( MUX.x["_00_7_"] & 0x1 ) << 7 	;
			break;
			case 1:
				MUX.x["_Out_"] = MUX.x["_01_"] = 
					( MUX.x["_01_0_"] & 0x1 ) 		|
					( MUX.x["_01_1_"] & 0x1 ) << 1 	|
					( MUX.x["_01_2_"] & 0x1 ) << 2 	|
					( MUX.x["_01_3_"] & 0x1 ) << 3 	|
					( MUX.x["_01_4_"] & 0x1 ) << 4 	|
					( MUX.x["_01_5_"] & 0x1 ) << 5 	|
					( MUX.x["_01_6_"] & 0x1 ) << 6 	|
					( MUX.x["_01_7_"] & 0x1 ) << 7 	;
			break;
			case 2:
				MUX.x["_Out_"] = MUX.x["_10_"] = 
					( MUX.x["_10_0_"] & 0x1 ) 		|
					( MUX.x["_10_1_"] & 0x1 ) << 1 	|
					( MUX.x["_10_2_"] & 0x1 ) << 2 	|
					( MUX.x["_10_3_"] & 0x1 ) << 3 	|
					( MUX.x["_10_4_"] & 0x1 ) << 4 	|
					( MUX.x["_10_5_"] & 0x1 ) << 5 	|
					( MUX.x["_10_6_"] & 0x1 ) << 6 	|
					( MUX.x["_10_7_"] & 0x1 ) << 7 	;
			break;
			case 3:
				MUX.x["_Out_"] = MUX.x["_11_"] = 
					( MUX.x["_11_0_"] & 0x1 ) 		|
					( MUX.x["_11_1_"] & 0x1 ) << 1 	|
					( MUX.x["_11_2_"] & 0x1 ) << 2 	|
					( MUX.x["_11_3_"] & 0x1 ) << 3 	|
					( MUX.x["_11_4_"] & 0x1 ) << 4 	|
					( MUX.x["_11_5_"] & 0x1 ) << 5 	|
					( MUX.x["_11_6_"] & 0x1 ) << 6 	|
					( MUX.x["_11_7_"] & 0x1 ) << 7 	;
			break;
			default:
				MUX.x["_Out_"] = MUX.x["_11_"] = 0;
			break;
			}
			// var _Out_ = MUX.x._Out_.toString(16);
			var _Out_ = MUX.x._Out_;
			if ( MUX.debug01 ) {
				console.log ( "  MUX: _Out_ =", _Out_ );
			}
			//	// <text id="mux_to_mpc" x="1280" y="140" class="vsmall"></text>
			var sVal = toHex(_Out_,2);
			$("#mux_to_mpc").text(sVal);
		break;
		}
		// xyzzy - pull CTL from Inputs (Microcode?)
		var c = MUX.x["_Ctl_1_"];
		var d = MUX.x["_Ctl_0_"];
		MUX.x["_Ctl_"] = c << 1 | d;
		MUX.func();
		var x = MUX.x["_Ctl_"];
		MUX.Display( x );
		AddMsg ( MUX.x.Name, "Microcode_Ld", "Out", MUX.x._Out_ );
	}

//	, tick: function ( ) {
//		MUX.func();
//		var x = MUX.x["_Ctl_"];
//		MUX.Display( x );
//
//		var out = MUX.x["_Out_"];
//		MICROCODE_PC.x["_InputBuffer_"] = out;
//		// MICROCODE_PC.msg("Ld",1);
//	}

	, func: function() {
		switch ( MUX.x["_Ctl_"] & 0x3 ) {
		case 0:
			MUX.x["_Out_"] = MUX.x["_00_"] & 0xff;
		break;
		case 1:
			MUX.x["_Out_"] = MUX.x["_01_"] & 0xff;
		break;
		case 2:
			MUX.x["_Out_"] = MUX.x["_10_"] & 0xff;
		break;
		case 3:
			MUX.x["_Out_"] = MUX.x["_11_"] & 0xff;
		break;
		}
		var out = MUX.x["_Out_"];
		MICROCODE_PC.x["_InputBuffer_"] = out;
		// MICROCODE_PC.msg("Ld",1);
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		// xyzzy - stuff
		MUX.x["_Ctl_0_"] = null;
		MUX.x["_Ctl_1_"] = null;
		MUX.x["_Ctl_"] = null;
	}
	, err: function () {
		return MUX.Error();
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( x ) {
		var sVal = toBin(x,2);
		$("#h_mux_txt").text(sVal);
		// xyzzy4000 -- beter display of in-to-out
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MICROCODE.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MICROCODE.x._Error );
	}

};
