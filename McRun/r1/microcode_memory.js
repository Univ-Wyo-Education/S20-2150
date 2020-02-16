
// Microcode (256 words of 64 wide)
// ========

var my;
var theOutsideWorld;
var fs;

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
			, "_data1_": new Array(256)	// 32 bits
			, "_data2_": new Array(256) // 32 bits
			, "_InputBuffer_": 0
			, "_OutputBuffer_": 0
			, "_Addr_": null
			, "CurState": 0
			, "NewState": 0
			, "_Errors_": []
			, "_Output_Lines_": {
			}
		};
		return ( my );
	}
	, msg: function ( wire, val ) {
		switch ( wire ) {
		case "Addr": if ( val === 1 ) { my["_data1_"] = 0; }								TurnOn( "pc_Clr" );   Display( my["_data1_"]); break;
		case "Out": if ( val === 1 ) { my["_OutputBuffer_"] = my["_data_"]; PushBus(); }    TurnOn( "pc_Out" );   Display( my["_data_"]); break;
		default:
			Error ( "Invalid Message", wire, val );
		}
	}
	, tick: function ( ) {
		if ( my["_Ld_"] === 1 ) {
			PullBus();
			my["_data1_"] = my["_InputBuffer_"];
		}
		if ( my["_Out_"] === 1 ) {
			// my["_OutputBuffer_"] = my["_data1_"];
			// my["_OutputBuffer_"] = my["_data2_"];
			PushBus();
		}

		Display( my["_data1_"] );

		// After Tick Cleanup 
		my["_InputBuffer_"] = null;
		my["_Addr_"] = null;
	}
	, err: function () {
		return Error();
	}
	, test_peek: function() {
		return ( my["_data1_"] );
	}
	, clear_errors: function ( ) {
		my["_Errors_"] = [];
	}
	, load_from_file: function ( fn ) {
		if ( fs === undefined ) {
			fs = require('fs');
		}
		fs.readFile(fn, 'utf8', function(err, contents) {
			if ( err ) {
				my["_Errors_"].push ( "Error reading file: "+fn+" Error: "+err );
			} else {
				// console.log(contents);
				ParseInput(contents);
			}
		});
	}
};

function PullBus() {
	// if(theOutsideWorld.Bus && typeof theOutsideWorld.Bus.State === "function") {
	// 	 my["_InputBuffer_"] = theOutsideWorld.Bus.State();
	// }
	// xyzzy - maybee pull input -> _addr_ ??
}

function PushBus() {
	var addr = my["_Addr_"];
	if ( addr === null ) {
		console.log ( "MC Memory: No _addr_ to use." )
		addr = 255;
	}
	for ( key in my["_Output_Lines_"] ) {
		var def = my["_Output_Lines_"][key];
		var mcWord = my[def.DataArray][addr];
		var val = !!( mcWord & ( 1 << def.NthBit ) );	
		if(theOutsideWorld[key] && typeof theOutsideWorld[key].SetState === "function") {
			theOutsideWorld[key].SetState( val );
		} else {
			console.log ( "MC Memory: No output connected to:", key )
		}
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
	return ( my["_Errors_"] );
}

/*
0000000430000001 000
0000000144000000 001
0000000008c00008 002
436f646520427920 003
*/
function ParseInput(data) {
	var array = data.toString().split("\n");
	var pc = 0;
	var st = 0;
    for(i in array) {
        console.log(array[i]);
		const str = array[i];
		if ( str === "##1" ) {
			st = 1;
		} else if ( st === 0 ) {
			const words = str.split(' ');
			const str2 = words[0];
			console.log(words[0]);
			const p1 = str2.substr(0, 8)
			const p2 = str2.substr(8)
			console.log("p1 ->"+p1+"<- p2 ->"+p2+"<-");
			const p1x = parseInt(p1,16);
			const p2x = parseInt(p2,26);
			my["_data1_"][pc] = p1x;
			my["_data2_"][pc] = p2x;
			pc++;
		} else if ( st === 1 ) {
			// Associate bit with "line" that is turned on.
			const words = str.split(' ');
			const str2 = words[0];		// LineName ####
			const pos = 0 + words[1];
			var da = "_data1_";
			var nb = pos;
			if ( pos > 32 ) {
				da = "_data2_";
				nb = pos - 32;
			}	
			my["_Output_Lines_"][words[0]] = {
				Loc: pos,
				NthBit: nb,
				Name: words[0],
				DataArray: da
			};
		}
    }
	console.log ( JSON.stringify ( my) );
}

