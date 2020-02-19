
// ALU : Arethmetic Logic Unit
// ========

var my;
var theOutsideWorld;

module.exports = {
	setupSelf: function ( OutsideWorld ) {
		console.log ( "Setup Self" );
		theOutsideWorld = OutsideWorld;
		my = {
			  "Name": "ALU"
			, "TalkTo": OutsideWorld
			, "Group": "Register"
			, "Interface": {
				  "vcc" : { "width": 1, "mode": "i" }
				, "gnd" : { "width": 1, "mode": "i" }
				, "ctl" : { "width": 4, "mode": "i" }
				, "A"  : { "width": 16, "mode": "i" }
				, "B" : { "width": 16, "mode": "i" }
				, "Out" : { "width": 16, "mode": "i" }	// Turn on Output on "bus"
			}
			, "_data_": 0
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_A_": null
			, "_B_": null
			, "_ctl_": null
			, "_out_": null
			, "CurState": 0
			, "NewState": 0
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "ctl": if ( val === 1 ) { my["_ctl_"] = val; }									TurnOn( "alu_ctl" );   Display( my["_ctl_"], my["_out_"]); break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {

		Display( my["_ctl_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_ctl_"] = null;
		my["_out_"] = null;
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

