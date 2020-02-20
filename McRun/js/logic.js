
// Logic : Hard coded logic (and gate etc) for Hand-Out
// ========

var my;
var theOutsideWorld;

module.exports = {
	setupSelf: function ( OutsideWorld ) {
		console.log ( "Setup Self" );
		theOutsideWorld = OutsideWorld;
		my = {
			  "Name": "PC"
			, "TalkTo": OutsideWorld
			, "Group": "Register"
			, "Interface": {
				  "bus" : { "width": 16, "mode": "io" }
				, "vcc" : { "width": 1, "mode": "i" }
				, "gnd" : { "width": 1, "mode": "i" }
				, "hand_out" : { "width": 1, "mode": "i" }
			}
			, "_data_": 0
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_hand_out_": null
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "hand_out": if ( val === 1 ) { my["_data_"] = 0; }									TurnOn( "hand_out" );   Display( my["_data_"]); break;
		case "bus": if ( val === 1 && my["_Ld_"] === 1 ) { PullBus(true); my["_data_"] = my["_InputBuffer_"]; }                   break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {

		Display( my["_data_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_hand_out_"] = null;
		my["_bus_"] = null;
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

