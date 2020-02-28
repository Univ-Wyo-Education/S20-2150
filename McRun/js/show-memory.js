// Memory Display and tracking Related

// xyzzy - todo - display of memory history 
var MemRWHist = [];

// xyzzy - todo
var MemBreakOn = [];		// Array of memory break points for read/write - list of addresses.

// DisAssembler will disasemble instructions xIns and return this string.
function DisAssembler ( xIns ) {
	var op = xIns & 0xF000;
	var hand = xIns & 0x0fff;
	op = ( op >> 12 ) & 0xf;

	var s = "";
	switch ( op ) {
	case 0x0: // JnS
		s = "JnS      " + toHex(hand,4);
	break;
	case 0x1: // Load
		s = "Load     " + toHex(hand,4);
	break;
	case 0x2: // Store
		s = "Store    " + toHex(hand,4);
	break;
	case 0x3: // Add
		s = "Add      " + toHex(hand,4);
	break;
	case 0x4: // Subt
		s = "Subt     " + toHex(hand,4);
	break;
	case 0x5: // Input
		s = "Input    " ;
	break;
	case 0x6: // Output
		s = "Output   " ;
	break;
	case 0x7: // Halt
		s = "Halt    " ;
	break;
	case 0x8: // Skipcond
		if ( ( ( hand & 0x0f00 ) >> 8 ) == 0x0 ) {
			// OpSkipLt0     // 00
			s = "SkipLt0    " ;
		} else if ( ( ( hand & 0x0f00 ) >> 8 ) == 0x4 ) {
			// OpSkipEq0     // 01
			s = "SkipEq0    " ;
		} else if ( ( ( hand & 0x0f00 ) >> 8 ) == 0x8 ) {
			// OpSkipGt0     // 10
			s = "SkipGt0    " ;
		} else {
			var h = toHex ( xIns, 4 );
			s = "Skip? Inv. " + h;
		}
	break;
	case 0x9: // Jump
		s = "Jump     " + toHex(hand,4);
	break;
	case 0xA: // Clear
		s = "Clear     " ;
	break;
	case 0xB: // AddI
		s = "AddI     " + toHex(hand,4);
	break;
	case 0xc: // JumpI
		s = "JumpI    " + toHex(hand,4);
	break;
	case 0xd: // LoadI
		s = "LoadI    " + toHex(hand,4);
	break;
	case 0xe: // StoreI
		s = "StoreI   " + toHex(hand,4);
	break;
	default:
		var h = toHex ( xIns, 4 );
		s = "Invalid    " + h
	break;
	}

	return s;

}

function Dis1Word(pc) {
	var s, sPc = toHex(pc,4);
	if ( pc >= 0 && pc < mm_max ) {
		var mm = MEMORY.x._data_[pc];
		s = sPc + ": " + toHex(mm,4) + "/" + toDec(mm,5) + " : " + DisAssembler ( mm );
	} else {
		s = sPc + " out of range."
	}
	return s;
}

function showMemoryAtPC ( pc, rw, at, by ) {
	var xpc = pc - 6;
	if ( xpc < 0 ) {
		xpc = 0;
	}
	var pa = [];
	for ( var ii = xpc ; ii < (pc+6) && ii < mm_max ; ii++ ) {
		var s = Dis1Word(ii);
		if ( ii === pc ) {
			s += " <<==--- ";
		}
		pa.push ( s );
	}

	if ( rw === 'r' || rw === 'w' ) {
		// show memory for read/write at location.
		pa.push ( "" );
		var sAt = toHex(at,4);
		var sBy = "";
		if ( by ) {
			sBy = " By: "+by;
		}
		var mRw = "";
		if ( rw === 'r' ) {
			mRw = "Read: "+sAt+sBy ;
		} else {
			mRw = "Write: "+sAt+sBy ;
		}
		pa.push ( mRw );
		MemRWHist.push ( mRw );
	}

	displayMemoryTextArr(pa);
}


