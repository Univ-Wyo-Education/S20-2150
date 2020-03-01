
// MEMORY (new)
// ========

var MEMORY = {
	  "x": {
		  "Name": "MEMORY"
		, "_data_": new Array(1024*16)	// 16 bits	- 16k of memory
		, "_InputBuffer_": 0
		, "_OutputBuffer_": 0
		, "_Write_": null
		, "_Read_": null
		, "_Addr_": null
		, "_Error_": []
	}
	, debug0: 0
	, msg: function ( wire, val ) {
		var addr = MAR.x["_data_"];
		addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
		MEMORY.x["_Addr_"] = addr;
		switch ( wire ) {
		case "Read": 				
			if ( val === 1 ) {
				MEMORY.x["_Read_"] = 1;
				MEMORY.PullMAR();			// xyzzy - deps on MAR & MDR
				MEMORY.TurnOn( "memory_Read" );
			}
			MEMORY.Display( addr );
		break;
		case "Write":				// Resolves MDR, uses MAR
			if ( val === 1 ) {
				MEMORY.x["_Write_"] = 1;
				MEMORY.PushMDR();
				MEMORY.TurnOn( "memory_Write" );
			}
			MEMORY.Display( addr );
		break;
		case 'rise':			// Act-CLeanup
			MEMORY.rise();
		break;
		default:
			MEMORY.Error ( "Invalid Message", wire, val );
		break;
		}
	}

	// After Tick Cleanup 
	, rise: function ( ) {
		if ( MEMORY.x["_Write_"] === 1 ) {
			MEMORY.Error ( "Failed To Resolve", "Write", 1 );
		}
		MEMORY.x["_InputBuffer_"] = null;
		MEMORY.x["_OutputBuffer_"] = null;
		MEMORY.x["_Write_"] = null;
		MEMORY.x["_Read_"] = null;
	}

	, PullMAR: function () { // Memory Read
console.log ( "MEMORY:PullMAR (read) New / Add Closure - Closure DEP on MAR and MDR" );
		AddDep ( MEMORY.x.Name, [ "Memory_Addr" ], "Out", function () {
			 	// Address Info In
			 	// MEMORY.x["_Addr_"] = theWorld2.MAR;
			 	MEMORY.x["_Addr_"] = theWorld2.Memory_Addr;
				var addr = MEMORY.x["_Addr_"];
console.log ( "MEMORY:PullMAR Memory Read addr=",addr.toString(16));
				if ( addr < 0 || addr >= mm_max ) { MEMORY.Error ( "Address in Error", "PulMAR", addr ); }
					// showIsError ( true );
				addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
			 	MEMORY.x["_Addr_"] = addr;
			 	MEMORY.x["_OutputBuffer_"] = MEMORY.x["_data_"][addr];
console.log ( "MEMORY:PullMAR Memory Read addr=",addr.toString(16),"Output=", MEMORY.x._OutputBuffer_.toString(16) );
				MEMORY.Display( addr );
				MEMORY.TurnOn( "memory_Read"  );
				MEMORY.x["_Read_"] = 2;
				AddMsg ( MEMORY.x.Name, "Memory_to_MDR", "Out", MEMORY.x._OutputBuffer_ );
				AddMsg ( MEMORY.x.Name, "Ld_From_Memory", "Out", MEMORY.x._OutputBuffer_ );
				// case "Ld_From_Memory": 	// Reaa From Memory
		});													
	}

	, PushMDR: function () {	// Memory Write
console.log ( "MEMORY:PushMDR (write) New/Out:", MEMORY.x._OutputBuffer_ );		
		AddDep ( MEMORY.x.Name, [ "MAR", "Memory_to_MDR" ], "Out", function () {
console.log ( "MEMORY:PushMAR Closure Run" );
			 	MEMORY.x["_InputBuffer_"] = theWorld2.Memory_to_MDR;
			 	MEMORY.x["_Addr_"] = theWorld2.Memory_Addr;
				var addr = MEMORY.x["_Addr_"];
				if ( addr < 0 || addr >= mm_max ) { MEMORY.Error ( "Address in Error", "PushMDR", addr ); }
				addr = ( addr >= 0 && addr < mm_max ) ? addr : 0;
			 	MEMORY.x["_Addr_"] = addr;
			 	// MEMORY.x["_OutputBuffer_"] = MEMORY.x["_data_"][addr];
				MEMORY.x["_data_"][addr] = MEMORY.x["_InputBuffer_"];
				MEMORY.Display( addr );
				MEMORY.TurnOn( "memory_Write"  );
				MEMORY.x["_Write_"] = 2;
				AddMsg ( MEMORY.x.Name, "Memory_to_MDR", "Out", MEMORY.x._InputBuffer_ );
				// AddMsg ( MEMORY.x.Name, "Out_To_Memory", "Out", MEMORY.x._InputBuffer_ );
				// case "Out_To_Memory":		// Write to Memory
		});													
	}

	// Turn on display of a wire with this ID
	, TurnOn: function  ( id ) {
		infoOn1 ( -1, "id_"+id );
	}

	// Display text to inside of register box
	// show the address that is in MAR - as mid pos 7 of 16 in memory.
	, Display: function  ( addr ) {
		showMemoryAtPC ( addr );
	}

	// Return any errors generated in this "chip"
	, Error: function  ( errorMsg, wire, val ) {
		if ( errorMsg ) {
			MEMORY.x._Error_.push ( errorMsg + " wire:"+wire + " val:" + toHex(val,4) );
		}
		return ( MEMORY.x._Error );
	}

};

