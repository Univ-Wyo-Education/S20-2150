
// ----------------------------------------------------------------------------
// Chip - PC Register
// ----------------------------------------------------------------------------

// Data
var PC_Data = {
	"Reg": 0			// 8 bits
	,"pc_Ld": 0			
	,"pc_Inc": 0
	,"pc_Out": 0
	,"pc_Clr": 0
	,"pc_Input": 0		// 8 bits
	,"pc_Output": 0		// 8 bits
	,"Pins": [
	]
}

// Setup
function PC_Setup ( From, To, Width ) {
	if ( ! Width ) {
		Width = 1;
	}
	PC_Data.Pins.push ( { "From": From, "To": To, "Width": Width } );
}

// Run - One Clock Tick
function PC_Tick () {
	PC_Data.pc_Output = null;
	PC_Data.pc_Ld = GetWire(PC_Data.Pins,"pc_Ld"); 
	PC_Data.pc_Inc = GetWire(PC_Data.Pins,"pc_Inc"); 
	PC_Data.pc_Out = GetWire(PC_Data.Pins,"pc_Out"); 
	PC_Data.pc_Clr = GetWire(PC_Data.Pins,"pc_Clr"); 

	// Check for Errors, More than 1 of: pc_Ld, pc_Inc, pc_Clr

	if ( PC_Data.pc_Ld === 1 ) {
		PC_Data.pc_Input = PullBus();
		PC_Data.Reg = PC_Data.pc_Input;
	}
	if ( PC_Data.pc_Inc === 1 ) {
		PC_Data.Reg++;
	}
	if ( PC_Data.pc_Out === 1 ) {
		PC_Data.pc_Output = PC_Data.Reg;
		DriveBus ( "PC", PC_Data.pc_Output );
	}
	if ( PC_Data.pc_Clr === 1 ) {
		PC_Data.Reg = 0;
	}
}

function PC_Tick_Cleanup () {
	PC_Data.pc_Ld = null;
	PC_Data.pc_Inc = null;
	PC_Data.pc_Out = null;
	PC_Data.pc_Clr = null;
	PC_Data.pc_Output = null;	 // ??
}

PC_Setup ( "Microcode[16]_pc_Ld", "pc_Ld" );
PC_Setup ( "Microcode[17]_pc_Inc", "pc_Inc" );
PC_Setup ( "Microcode[18]_pc_Clr", "pc_Clr" );
PC_Setup ( "Microcode[19]_pc_Out", "pc_Out" );
PC_Setup ( "Bus[0-16]", "pc_Input", 16 );
PC_Setup ( "Bus[0-16]", "pc_Output", 16 );

// ----------------------------------------------------------------------------
// Bus
// ----------------------------------------------------------------------------

var Bus = 0;
var BusWhoSet = [];

function PullBus() {
	return Bus & 0xffff;
}

function DriveBus ( Name, Data ) {
	BusWhoSet.Push(Name);
	Bus = Data & 0xffff;
}

function BusEndTick () {
	if ( BusWhoSet.length > 1 ) {
		console.log ( "Error: more than 1 bus driver", BusWhoSet );
	}
	BusWhoSet = [];
}


