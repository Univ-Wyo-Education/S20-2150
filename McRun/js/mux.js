
// MUX : 8 wide, 4 inputs to 1 output mux
// ========

var MUX = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MUX" );
	}
	, "x": {
		  "Name": "MUX"
		, "Group": "Logic"
		, "Interface": {
			  "bus" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "00" : { "width": 8, "mode": "i" }
			, "01" : { "width": 8, "mode": "i" }
			, "10" : { "width": 8, "mode": "i" }
			, "11" : { "width": 8, "mode": "i" }
			, "Out" : { "width": 8, "mode": "o" }
			, "Ctl" : { "width": 2, "mode": "i" }
		}
		, "_Ctl_0_": null
		, "_Ctl_1_": null
		, "_Ctl_": null
		, "_00_": null
		, "_01_": null
		, "_10_": null
		, "_11_": null
		, "_Out_": null
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ctl":
			val = val & 3;
			MUX.x["_Ctl_"] = val;
			MUX.x["_Ctl_0_"] = val & 1;
			MUX.x["_Ctl_1_"] = val & 2;
		break;
		case "Ctl_0":
			MUX.x["_Ctl_0_"] = val & 1;
		break;
		case "Ctl_1":
			MUX.x["_Ctl_1_"] = val & 1;
		break;
		default:
console.log ( "  MUX: Op="+wire )
			// Error ( "Invalid Message", wire, val );
			// 00_x
			// 01_x
			// 10_x
			// 11_x
		break;
		}
		// xyzzy - pull CTL from Inputs (Microcode?)
		var c = MUX.x["_Ctl_1_"];
		var d = MUX.x["_Ctl_0_"];
		MUX.x["_Ctl_"] = c << 1 | d;
		MUX.func();
		var x = MUX.x["_Ctl_"];
		MUX.Display( x );
	}
	, tick: function ( ) {
		MUX.func();
		var x = MUX.x["_Ctl_"];
		MUX.Display( x );
	}

	, func: function() {
		switch ( MUX.x["_Ctl_"] & 0x3 ) {
		case 0:
			MUX.x["_Out_"] = Mux.x["_00_"] & 0xff;
		break;
		case 1:
			MUX.x["_Out_"] = Mux.x["_01_"] & 0xff;
		break;
		case 2:
			MUX.x["_Out_"] = Mux.x["_10_"] & 0xff;
		break;
		case 3:
			MUX.x["_Out_"] = Mux.x["_11_"] & 0xff;
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
	}
	, err: function () {
		return Error();
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( x ) {
		var sVal = toBin(x,2);
		$("#h_mux_txt").text(sVal);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
