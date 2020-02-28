
// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------

var test0001 = false;	// Turn on the line from the PC data
var test0002 = false;	// Display value in the PC register
var test0003 = false;	// Send message to PC and see it turn on.
var test0004 = false;	// Send data from Result to PC and see it in both.
var test0005 = false;	// PC -> IR (abnomral move, what could be better?)
var test0006 = false;	// Show Memory Read Line - via MEMORY.msg
var test0007 = false;	// Show Memory Write Line - via MEMORY.msg
var test0008 = true;	// MC: Set to address 0, test output - see that they are turned on.
						// id_mar_Ld id_pc_Out id_mdr_Ld id_memory_Read  

if ( test0001 ) {
	PC.x["_data_"] = "0123";	// 0x7b
	PC.msg("Clr", 1);
	// Just Display: PC.TurnOn( "pc_Clr" );
	PC.Display(PC.x["_data_"]); 
}
if ( test0002 ) {
	PC.x["_data_"] = "0123";	// 0x7b
	PC.Display(PC.x["_data_"]); 
}
if ( test0003 ) {
	PC.x["_data_"] = 16;
	PC.msg("Inc", 1);
}
if ( test0004 ) {
	RESULT.msg("Out", 1);
	PC.msg("Ld", 1);
	RESULT.x["_data_"] = 32;
	for ( var ii = 0; ii < 2; ii++ ) {	// Tick to depth of propgation of signals
		PC.tick();
		RESULT.tick();
	}
	PC.rise();
}
if ( test0005 ) {
	RESULT.msg("Ld", 1);
	PC.msg("Out", 1);
	PC.x["_data_"] = 4428;	// 0x114c
	RESULT.x["_data_"] = 32;
	for ( var ii = 0; ii < 2; ii++ ) {	// Tick to depth of propgation of signals
		PC.tick();
		RESULT.tick();
	}
	PC.rise();
	RESULT.rise();
}
if ( test0006 ) {
	MEMORY.msg("Read", 1);
}
if ( test0007 ) {
	MEMORY.msg("Write", 1);
}
if ( test0008 ) {
	MICROCODE_PC.msg("Clr", 1);
	MICROCODE.msg("Addr", 1);
}

function test0009() {
	MICROCODE.msg("Addr", 1);	// Simulate the RUN clock on the Microcode_PC
	// MAR.msg('Ld', 1);
//	MAR.tick();
//	PC.tick();
//	IR.tick();
//	AC.tick();
//	RESULT.tick();
}

function test000A() {
	clearOtherLine();
	MICROCODE.rise();
}
