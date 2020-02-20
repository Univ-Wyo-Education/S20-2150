
// ALU : Arethmetic Logic Unit
// ========

var ALU = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/ALU" );
	}
	, "x": {
		  "Name": "ALU"
		, "Group": "Logic"
		, "Interface": {
			  "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
			, "Out" : { "width": 16, "mode": "o" }
			, "A"   : { "width": 16, "mode": "i" }
			, "B"   : { "width": 16, "mode": "i" }
		}
		, "_Ctl_0_": null
		, "_Ctl_1_": null
		, "_Ctl_2_": null
		, "_Ctl_3_": null
		, "_Ctl_": null
		, "_A_": null
		, "_B_": null
		, "_Out_": null
		, "_func_name_": ""
	}
	, msg: function ( wire, val ) {
		// xyzzy - pull CTL from Inputs (Microcode?)
		var a = ALU.x["_Ctl_3_"];
		var b = ALU.x["_Ctl_2_"];
		var c = ALU.x["_Ctl_1_"];
		var d = ALU.x["_Ctl_0_"];
		ALU.x["_Ctl_"] = a << 3 | b << 2 | c << 1 | d;
		ALU.func();
		var x = ALU.x["_Ctl_"];
		var y = ALU.x["_func_name_"];
		ALU.Display( x, y );
	}
	, tick: function ( ) {
		ALU.func();
		var x = ALU.x["_Ctl_"];
		var y = ALU.x["_func_name_"];
		ALU.Display( x, y );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		ALU.x["_Ctl_0_"] = null;
		ALU.x["_Ctl_1_"] = null;
		ALU.x["_Ctl_2_"] = null;
		ALU.x["_Ctl_3_"] = null;
		ALU.x["_Ctl_"] = null;
		ALU.x["_A_"] = null;
		ALU.x["_B_"] = null;
		ALU.x["_Out_"] = null;
		ALU.x["_func_name_"] = "";
	}
	/*
		Our ALU has 4 control inputs.

		| i3 | i2 | i1 | i0 | Used   | Action Taken                                          |
		|:--:|:--:|:--:|:--:|:------:|:------------------------------------------------------|
		|  0 | 0  |  0 |  0 |    *   |  2s Compliment                                        |
		|  0 | 0  |  0 |  1 |        |                                                       |
		|  0 | 0  |  1 |  0 |    *   |  Increment by 1, ac + 1 -> Result                     |
		|  0 | 0  |  1 |  1 |        |  Decrement by 1, 2s compliment, result = ac - 1       |
		|  0 | 1  |  0 |  0 |    *   |	Add: result = ac + bus (mdr usually)                 |
		|  0 | 1  |  0 |  1 |    *   |  Sub: subtract A - B                                  |
		|  0 | 1  |  1 |  0 |        |  A >> B - Arithmetic - fills with MSB                 |
		|  0 | 1  |  1 |  1 |    *   |  A == B - if A == B, result <- 1                      |
		|  1 | 0  |  0 |  0 |        |  Compliment: Toggle each bit in result = ^ac          |
		|  1 | 0  |  0 |  1 |    *   |  1 if AC less than 0, 2s compliment                   |
		|  1 | 0  |  1 |  0 |    *   |  1 if AC greater than 0, 2s compliment                |
		|  1 | 0  |  1 |  1 |        |  A and B                                              |
		|  1 | 1  |  0 |  0 |        |  A or B                                               |
		|  1 | 1  |  0 |  1 |        |  A xor B                                              |
		|  1 | 1  |  1 |  0 |        |  A >> B - logical - 0 fill   - Shift Right            |
		|  1 | 1  |  1 |  1 |        |  A << B - logical - 0 fill   - Shift Left             |
	*/
	, func: function ( ) {
		ALU.PullBus();
		var o;
		switch ( ALU.x["_Ctl_"] ) {
		case 0: // 0x0
			o = -ALU.x["_A_"];
			ALU.x["_func_name_"] = "Unary -";
		break;
		case 1: // 0x1
			// ??? xyzzy ??? NOP?
			ALU.x["_func_name_"] = "NOP";
		break;
		case 2: // 0x2
			o = ALU.x["_A_"] + 1;
			ALU.x["_func_name_"] = "Inc";
		break;
		case 3: // 0x3
			o = ALU.x["_A_"] - 1;
			ALU.x["_func_name_"] = "Dec";
		break;
		case 4: // 0x4
			o = ALU.x["_A_"] + ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A+B)";
		break;
		case 5: // 0x5
			o = ALU.x["_A_"] - ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A-B)";
		break;
		case 6: // 0x6
			o = ALU.x["_A_"] >> ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A>>B)";
		break;
		case 7: // 0x7
			o = ( ALU.x["_A_"] == ALU.x["_B_"] ) ? 1 : 0;
			ALU.x["_func_name_"] = "(A==B)";
		break;
		case 8: // 0x8
			o = ~ ALU.x["_A_"];
			ALU.x["_func_name_"] = "~A";
		break;
		case 9: // 0x9
			o = ( ALU.x["_A_"] < 0 ) ? 1 : 0;
			ALU.x["_func_name_"] = "(A<B)=>1";
		break;
		case 10: // 0xa
			o = ( ALU.x["_A_"] > 0 ) ? 1 : 0;
			ALU.x["_func_name_"] = "(A>B)=>1";
		break;
		case 11: // 0xb
			o = ALU.x["_A_"] & ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A&B)";
		break;
		case 12: // 0xc
			o = ALU.x["_A_"] | ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A|B)";
		break;
		case 13: // 0xd
			o = ALU.x["_A_"] ^ ALU.x["_B_"];
			ALU.x["_func_name_"] = "(A^B)";
		break;
		case 14: // 0xe
			o = ALU.x["_A_"] >> ALU.x["_B_"];	// xyzzy - logical
			ALU.x["_func_name_"] = "(A>>B)L";
		break;
		case 15: // 0xf
			o = ALU.x["_A_"] << ALU.x["_B_"];	// xyzzy - logical
			ALU.x["_func_name_"] = "(A<<B)L";
		break;
		}
		ALU.x["_Out_"] = o;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( ALU.x["_data_"] );
	}

	, PullBus: function () {
		if(theWorld.Bus && typeof theWorld.Bus.State === "function") {
			 ALU.x["_B_"] = theWorld.Bus.State();
console.log ( "ALU:PullBus", ALU.x["_B_"] );
		}
		ALU.x["_A_"] = ( AC.x["_Out_to_ALU_"] === 1 ) ? AC.x["_data_"] : 0;
	}


	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( x, y ) {
		var sVal = toHex(x,1);
		$("#h_alu_txt").text(sVal+":"+y);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
