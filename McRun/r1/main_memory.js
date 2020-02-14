
// Main Memory 
// ========

var my;
var theOutsideWorld;

module.exports = {
	setupSelf: function ( OutsideWorld ) {
		console.log ( "Setup Self" );
		theOutsideWorld = OutsideWorld;
		my = {
			  "Name": "MainMemory"
			, "TalkTo": OutsideWorld
			, "Group": "Register"
			, "Interface": {
				  "bus" : { "width": 16, "mode": "io" }
				, "vcc" : { "width": 1, "mode": "i" }
				, "gnd" : { "width": 1, "mode": "i" }
				, "Read" : { "width": 1, "mode": "i" }
				, "Write"  : { "width": 1, "mode": "i" }
			}
			, "_data_": 0		// xyzzy 16bit wide 8k
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_Read_": null
			, "_Write_": null
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Read": if ( val === 1 ) { my["_data_"] = 0; }									TurnOn( "main_memory_Clr" );   Display( my["_data_"]); break;
		case "Write":  if ( val === 1 ) { my["_data_"] = my["_InputBuffer_"]; }				TurnOn( "main_memory_Ld"  );   Display( my["_data_"]); my["_Ld_"] = 1; break;
		case "bus": if ( val === 1 && my["_Ld_"] === 1 ) { PullBus(); my["_data_"] = my["_InputBuffer_"]; }                   break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( my["_Ld_"] === 1 ) {
			PullBus();
			my["_data_"] = my["_InputBuffer_"];
		}
		if ( my["_Out_"] === 1 ) {
			my["_OutputBuffer_"] = my["_data_"];
			PushBus();
		}

		Display( my["_data_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_Read_"] = null;
		my["_Write_"] = null;
	}
	, err: function () {
		return Error();
	}
};

function PullBus() {
	if(theOutsideWorld.Bus && typeof theOutsideWorld.Bus.State === "function") {
		 my["_InputBuffer_"] = theOutsideWorld.Bus.State();
	}
}

function PushBus() {
	if(theOutsideWorld.Bus && typeof theOutsideWorld.Bus.SetState === "function") {
		theOutsideWorld.Bus.SetState( my["_OutputBuffer_"] );
	}
}

// Turn on display of a wire with this ID
function TurnOn ( id ) {
	if(typeof theOutsideWorld.TurnOn === "function") {
		theOutsideWorld.TurnOn ( my.Name, my, id );
	} else {
		console.log ( "Turn On ("+my.Name+")", id );
	}
}

// Display text to inside of register box
function Display ( val ) {
	if(typeof theOutsideWorld.Display === "function") {
		theOutsideWorld.Display ( my.Name, my, val );
	} else {
		console.log ( "Display ("+my.Name+")", val );
	}
}

// Return any errors generated in this "chip"
function Error ( errorMsg, wire, val ) {
	return ( [] );
}

