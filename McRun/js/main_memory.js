
// Main Memory 
// ========

var MEMORY = {
	setupSelf: function ( ) {
		console.log ( "Setup Self/MEMORY" );
	}
	, "x": {
		  "Name": "MEMORY"
		, "Group": "Memory"
		, "Interface": {
			  "Out" : { "width": 16, "mode": "io" }
			, "vcc" : { "width": 1, "mode": "i" }
			, "gnd" : { "width": 1, "mode": "i" }
		}
		, "_data_": new Array(1024*2)	// 16 bits	- 2k of memory
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Addr_": null
		, "_Write_": null
		, "_Read_": null
	}
	, msg: function ( wire, val ) {
		var addr = MAR.x["_data_"];
		MEMORY.x["_Addr_"] = addr;
		switch ( wire ) {
		case "Read": 
			if ( val === 1 ) {
				MEMORY.x["_Read_"] = 1;
				MEMORY.PullMDR(true);
				MEMORY.x["_data_"][addr] = MEMORY.x["_InputBuffer_"];
				MEMORY.TurnOn( "memory_Read"  );  
			}
			MEMORY.Display( addr );
		break;
		case "Write":
			if ( val === 1 ) {
				MEMORY.x["_Write_"] = 1;
				MEMORY.x["_OutputBuffer_"] = MEMORY.x["_data_"];
				MEMORY.PushMDR();
				MEMORY.TurnOn( "memory_Write" );  
			}
			MEMORY.Display( addr );
		break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		var addr = MAR.x["_data_"];
		MEMORY.x["_Addr_"] = addr;
		if ( MEMORY.x["_Read)_"] === 1 ) {
			MEMORY.PullMDR();
			MEMORY.x["_data_"][addr] = MEMORY.x["_InputBuffer_"];
		}
		if ( MEMORY.x["_Write_"] === 1 ) {
			MEMORY.x["_OutputBuffer_"] = MEMORY.x["_data_"][addr];
			MEMORY.PushMDR();
		}
		MEMORY.Display( addr );
	}
	// After Tick Cleanup 
	, rise: function ( ) {
		MEMORY.x["_InputBuffer_"] = null;
		MEMORY.x["_Addr_"] = null;
		MEMORY.x["_Read_"] = null;
		MEMORY.x["_Write_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function(addr) {
		return ( MEMORY.x["_data_"][addr] );
	}

	, PullMDR: function () {
		MEMORY.x["_InputBuffer_"] = MDR.x["_data_"];
	}

	, PushMDR: function () {
		MDR.x["_data_"] = MEMORY.x["_OutputBuffer_"];
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	, Display: function  ( val ) {
		var sVal = toHex(val,4);
		// xyzzy - should show the address that is in MAR - as mid pos 7 of 16 in memory.
		// console.log ( "Padded", sVal );
		var a = sVal.substr(0,2);
		var b = sVal.substr(2,2);
		$("#h_memory_txt_0").text(a);
		$("#h_memory_txt_1").text(b);
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		return ( [] );
	}

};
