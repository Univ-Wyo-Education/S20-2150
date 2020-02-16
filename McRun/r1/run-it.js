// app.js
// ======
var PC = require('./pc_reg');
var IR = require('./ir_reg');
var AC = require('./ac_reg');
var INPUT = require('./input_reg');
var MAR = require('./mar_reg');
var MDR = require('./mdr_reg');
var MICROCODE_PC = require('./microcode_pc_reg');
var OUTPUT = require('./output_reg');
var RESULT = require('./result_reg');
var ALU = require('./alu');
var LOGIC = require('./logic');
var MAIN_MEMORY = require('./main_memory');
var MICROCODE_MEMORY = require('./microcode_memory');
var MUX = require('./mux');

// console.log(typeof tools.foo); // => 'function'

var theWorld = {
	"Bus": {
		"_data_": 0
		, "_used_": false
		, "_error_": []
		, "State": function () {
			if ( theWorld.Bus._used_ ) {
				return ( theWorld.Bus._data_ );
			} else {
				var ignore = false;
				if ( arguments.length > 0 ) {
					ignore = arguments[0];
				}
				if ( ! ignore ) {
					console.log ( "Warning: Pulling 'bus.State' when undefined" );
					theWorld.Bus._error_.push( "Warning: Pulling 'bus.State' when undefined" );
				}
				return ( theWorld.Bus._data_ );
			}
		}
		, "SetState": function ( v ) {
			theWorld.Bus._data_ = v;
			theWorld.Bus._used_ = true;
		}
		, "TickRise": function ( v ) {
			theWorld.Bus._used_ = false;
		}
		, "Error": function ( v ) {
			return ( theWorld.Bus._error_ );
		}
		, "ClearError": function ( v ) {
			theWorld.Bus._error_ = [];
		}
	}
	,"IsZero": {
		"_data_": 0
		, "_used_": false
		, "_error_": []
		, "State": function () {
			if ( theWorld.IsZero._used_ ) {
				return ( theWorld.IsZero._data_ );
			} else {
				var ignore = false;
				if ( arguments.length > 0 ) {
					ignore = arguments[0];
				}
				if ( ! ignore ) {
					console.log ( "Warning: Pulling 'bus.State' when undefined" );
					theWorld.IsZero._error_.push( "Warning: Pulling 'bus.State' when undefined" );
				}
				return ( theWorld.IsZero._data_ );
			}
		}
		, "SetState": function ( v ) {
			theWorld.IsZero._data_ = v;
			theWorld.IsZero._used_ = true;
		}
		, "TickRise": function ( v ) {
			theWorld.IsZero._used_ = false;
		}
		, "Error": function ( v ) {
			return ( theWorld.IsZero._error_ );
		}
		, "ClearError": function ( v ) {
			theWorld.IsZero._error_ = [];
		}
	}
	,"MAR_to_Memory": {
		"_data_": 0
		, "_used_": false
		, "_error_": []
		, "State": function () {
			if ( theWorld.IsZero._used_ ) {
				return ( theWorld.IsZero._data_ );
			} else {
				var ignore = false;
				if ( arguments.length > 0 ) {
					ignore = arguments[0];
				}
				if ( ! ignore ) {
					console.log ( "Warning: Pulling 'bus.State' when undefined" );
					theWorld.IsZero._error_.push( "Warning: Pulling 'bus.State' when undefined" );
				}
				return ( theWorld.IsZero._data_ );
			}
		}
		, "SetState": function ( v ) {
			theWorld.IsZero._data_ = v;
			theWorld.IsZero._used_ = true;
		}
		, "TickRise": function ( v ) {
			theWorld.IsZero._used_ = false;
		}
		, "Error": function ( v ) {
			return ( theWorld.IsZero._error_ );
		}
		, "ClearError": function ( v ) {
			theWorld.IsZero._error_ = [];
		}
	}
};
var chips = [];


var pc_my = PC.setupSelf ( theWorld );
chips.push ( pc_my );
var mar_my = MAR.setupSelf ( theWorld );
chips.push ( mar_my );
var mdr_my = MDR.setupSelf ( theWorld );
chips.push ( mdr_my );

var microcode_memory_my = MICROCODE_MEMORY.setupSelf ( theWorld );
chips.push ( microcode_memory_my );

// ---------------------------------------------------------------------------------------------------------------------------------

var test = false;
var test001 = false;
var test002 = true;
var err = 0;
var errList = [];


// Test 1

if ( test001 ) {
	test = true;

	// Verify PC at 0 for initial output
	console.log ( "PC=", PC );

	// Force data into PC to start test.
	theWorld.Bus._data_ = 16;

	// Turn on Ld
	PC.msg ( "Ld",  1 );
	PC.tick();
	theWorld.Bus.TickRise();

	PC.msg ( "Inc", 1 );
	PC.tick();
	theWorld.Bus.TickRise();

	PC.msg ( "Out", 1 );
	MAR.msg ( "Ld", 1 );
	PC.tick();
	theWorld.Bus.TickRise();

	// done: - Verify "bus" output is 16
	// done: Verify 17 in PC
	console.log ( "Bus: 17 = ", theWorld.Bus._data_ );
	if ( theWorld.Bus._data_ !== 17 ) {
		err++;
		errList.push ( "Bus not 17" );	
	}

	// xyzzy: - Verify "MAR" _data_ output is 17
	var v = MAR.test_peek();
	if ( v != 17 ) {
		err++;
		errList.push ( "MAR not 17" );	
	}
}

// Test 2
if ( test002 ) {
	test = true;

	MICROCODE_MEMORY.load_from_file("microcode.hex");
}


// ---------------------------------------------------------------------------------------------------------------------------------

if ( test && err > 0 ) {
	console.log ( "" );
	console.log ( "FAIL" );
} else if ( test ) {
	console.log ( "" );
	console.log ( "PASS" );
}


