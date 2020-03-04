
// ALU : Arethmetic Logic Unit
// ========

var ALU = {
	  "x": {
		  "Name": "ALU"
		, "_Ctl_0_": null
		, "_Ctl_1_": null
		, "_Ctl_2_": null
		, "_Ctl_3_": null
		, "_Ctl_": null
		, "_A_": null
		, "_B_": null
		, "_Out_": null
		, "_func_txt_": ""
		, "__debug__": true
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Ctl":
			val = val & 0xf;
			ALU.x["_Ctl_"] = val;
			ALU.x["_Ctl_0_"] = val & 1;
			ALU.x["_Ctl_1_"] = ( val & 2 ) >> 1;
			ALU.x["_Ctl_2_"] = ( val & 4 ) >> 2;
			ALU.x["_Ctl_3_"] = ( val & 8 ) >> 3;
		break;
		case "Ctl_0":
			ALU.x["_Ctl_0_"] = val & 1;
			ALU.x["_Ctl_"] = ( ALU.x["_Ctl_"] & 1 )  |  ALU.x["_Ctl_0_"] ;
		break;
		case "Ctl_1":
			ALU.x["_Ctl_1_"] = val & 1;
			ALU.x["_Ctl_"] = ( ALU.x["_Ctl_"] & 2 )  |  ( ALU.x["_Ctl_1_"] << 1 );
		break;
		case "Ctl_2":
			ALU.x["_Ctl_2_"] = val & 1;
			ALU.x["_Ctl_"] = ( ALU.x["_Ctl_"] & 4 )  |  ( ALU.x["_Ctl_2_"] << 2 );
		break;
		case "Ctl_3":
			ALU.x["_Ctl_3_"] = val & 1;
			ALU.x["_Ctl_"] = ( ALU.x["_Ctl_"] & 8 )  |  ( ALU.x["_Ctl_3_"] << 3 );
		break;
		default:
			ALU.PullBus();
		break;
		}
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
		ALU.x["_func_txt_"] = "";
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
	/*
		, "#h_alu_A_txt" 
		, "#h_alu_B_txt" 
		, "#h_alu_Out_txt" 
	*/
	, func: function ( ) {
		var o;
		switch ( ALU.x["_Ctl_"] ) {
		case 0: // 0x0
			o = -ALU.x["_A_"];
			ALU.x["_func_txt_"] = "Unary -";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").hide();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 1: // 0x1
			// ??? xyzzy ??? NOP?
			o = 0;
			ALU.x["_func_txt_"] = "NOP";
			$("#h_alu_A_txt").hide();
			$("#h_alu_B_txt").hide();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 2: // 0x2
			o = ALU.x["_A_"] + 1;
			ALU.x["_func_txt_"] = "Inc";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").hide();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 3: // 0x3
			o = ALU.x["_A_"] - 1;
			ALU.x["_func_txt_"] = "Dec";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").hide();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 4: // 0x4
			o = ALU.x["_A_"] + ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A+B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 5: // 0x5
			o = ALU.x["_A_"] - ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A-B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 6: // 0x6
			o = ALU.x["_A_"] >> ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A>>B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 7: // 0x7
			o = ( ALU.x["_A_"] == ALU.x["_B_"] ) ? 1 : 0;
			ALU.x["_func_txt_"] = "(A==B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 8: // 0x8
			o = ~ ALU.x["_A_"];
			ALU.x["_func_txt_"] = "~A";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 9: // 0x9
			o = ( ALU.x["_A_"] < 0 ) ? 1 : 0;
			ALU.x["_func_txt_"] = "(A<B)=>1";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 10: // 0xa
			o = ( ALU.x["_A_"] > 0 ) ? 1 : 0;
			ALU.x["_func_txt_"] = "(A>B)=>1";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 11: // 0xb
			o = ALU.x["_A_"] & ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A&B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 12: // 0xc
			o = ALU.x["_A_"] | ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A|B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 13: // 0xd
			o = ALU.x["_A_"] ^ ALU.x["_B_"];
			ALU.x["_func_txt_"] = "(A^B)";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 14: // 0xe
			o = ALU.x["_A_"] >> ALU.x["_B_"];	// xyzzy - logical
			ALU.x["_func_txt_"] = "(A>>B)L";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		case 15: // 0xf
			o = ALU.x["_A_"] << ALU.x["_B_"];	// xyzzy - logical
			ALU.x["_func_txt_"] = "(A<<B)L";
			$("#h_alu_A_txt").html(ALU.x._A_).show();
			$("#h_alu_B_txt").html(ALU.x._B_).show();
			$("#h_alu_Out_txt").html(o).show();
		break;
		default:
			ALU.x["_func_txt_"] = ALU.x._Ctl_;
			$("#h_alu_A_txt").hide();
			$("#h_alu_B_txt").hide();
			$("#h_alu_Out_txt").hide();
		break;
		}
		ALU.x["_Out_"] = o;
		AddMsg ( ALU.x.Name, "ALU_Out", "Out", ALU.x._Out_ );
	}
	, err: function () {
		return ALU.Error();
	}

	, PullBus: function () {
		// xyzzy4001 Proposed: AddDep ( ALU.x.Name, [ "Bus", "ac_Out_to_ALU" , [ [ "ALU_Ctl_0" , "ALU_Ctl_1" , "ALU_Ctl_2" , "ALU_Ctl_3" ], [ "ALU_Ctl" ] ] ], "Out", function () { 		
		AddDep ( ALU.x.Name, [ "Bus", "ac_Out_to_ALU" , "ALU_Ctl_0" , "ALU_Ctl_1" , "ALU_Ctl_2" , "ALU_Ctl_3" ], "Out", function () { 		
console.log ( "ALU:PullBus", ALU.x["_B_"] );
			if ( ALU.x._Ctl_ === null ) {
				console.log ( "AT:"+ln(), "Not Set _Ctl_" );
				if ( ALU.x._Ctl_0_ === null ) {
					console.log ( "AT:"+ln(), "Not Set _Ctl_0_" );
					var a = theWorld2["ALU_Ctl_3"];
					var b = theWorld2["ALU_Ctl_2"];
					var c = theWorld2["ALU_Ctl_1"];
					var d = theWorld2["ALU_Ctl_0"];
					console.log ( "AT:"+ln(), "a",a, "b",b, "c",c, "d", d );
					ALU.x["_Ctl_0_"] = d & 1;
					ALU.x["_Ctl_1_"] = c & 1;
					ALU.x["_Ctl_2_"] = b & 1;
					ALU.x["_Ctl_3_"] = a & 1;
					ALU.x["_Ctl_"] = ( a << 3 ) | ( b << 2 ) | ( c << 1 ) | d;
				} else if ( typeof theWorld2["ALU_Ctl"] !== "undefined" ) {
					console.log ( "AT:"+ln() );
					var val = theWorld2["ALU_Ctl"] & 0xf;
					ALU.x["_Ctl_"] = val;
					ALU.x["_Ctl_0_"] = ( val & 1 );
					ALU.x["_Ctl_1_"] = ( val & 2 ) >> 1;
					ALU.x["_Ctl_2_"] = ( val & 4 ) >> 2;
					ALU.x["_Ctl_3_"] = ( val & 8 ) >> 3;
				} else {
					console.error ( "AT:"+ln(), "Invalid config of ALU" );
				}
			}
			ALU.x["_A_"] = AC.x["_data_"];
			ALU.x["_B_"] = theWorld2["Bus"];
			
			var a = ( ALU.x["_Ctl_3_"] > 0 ) ? 1 : 0;
			var b = ( ALU.x["_Ctl_2_"] > 0 ) ? 1 : 0;
			var c = ( ALU.x["_Ctl_1_"] > 0 ) ? 1 : 0;
			var d = ( ALU.x["_Ctl_0_"] > 0 ) ? 1 : 0;
			ALU.x["_Ctl_"] = a << 3 | b << 2 | c << 1 | d;

console.log ( "ALU.x._Ctl_ =", ALU.x["_Ctl_"] );
			ALU.func();

			var x = ALU.x["_Ctl_"];
			var y = ALU.x["_func_txt_"];
			if ( ALU.x.__debug__ ) { console.log ( "x=", x, "y=", y ); }
			ALU.Display( x, y );
		} );
	}


	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( x, y ) {
		var sVal = toHex(x,1);
		$("#h_alu_txt").text(sVal+":"+y);
		// xyzzy4000 - Add to Dispaly - when function happens check for _func_A_ - if set, then show value above
		// _A_ line, then check for _func_B_ if set then show value input for _B_ line, then show output between
		// ALU and Result register.
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MICROCODE.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MICROCODE.x._Error );
	}

};
