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

// console.log(typeof tools.foo); // => 'function'

var theWorld = {
	"Bus": {
		"_data_": 0
		, "State": function () {
			return ( theWorld.Bus._data_ );
		}
		, "SetState": function ( v ) {
			theWorld.Bus._data_ = v;
		}
	}
};
var chips = [];

console.log ( "PC=", PC );

var pc_my = PC.setupSelf ( theWorld );
chips.push ( pc_my );

theWorld.Bus._data_ = 16;


// Test 1

PC.msg ( "Ld",  1 );

PC.tick();


