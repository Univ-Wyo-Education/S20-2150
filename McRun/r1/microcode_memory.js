
// Microcode (256 words of 64 wide)
// ========

var my;
var theOutsideWorld;

module.exports = {
	setupSelf: function ( OutsideWorld ) {
		console.log ( "Setup Self/Microcode" );
		theOutsideWorld = OutsideWorld;
		my = {
			  "Name": "Microcode"
			, "TalkTo": OutsideWorld
			, "Group": "Register"
			, "Interface": {
				  "out" : { "width": 64, "mode": "o" }
				, "vcc" : { "width": 1, "mode": "i" }
				, "gnd" : { "width": 1, "mode": "i" }
				, "Addr" : { "width": 8, "mode": "i" }
			}
			, "_data_": 0
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_Addr_": null
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Addr": if ( val === 1 ) { my["_data_"] = 0; }									TurnOn( "pc_Clr" );   Display( my["_data_"]); break;
		case "Out": if ( val === 1 && my["_Ld_"] === 1 ) { PullBus(); my["_data_"] = my["_InputBuffer_"]; }                   break;
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
		my["_Addr_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( my["_data_"] );
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

