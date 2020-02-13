// app.js
// ======
var PC = require('./pc_reg');
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


