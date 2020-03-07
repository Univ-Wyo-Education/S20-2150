// Move Instruction from Main Memory to IR
// 3 Tick
	mar_Ld = 1; pc_out = 1; mdr_Ld = 1; 
	ir_Ld = 1; mdr_out = 1; pc_inc = 1; 
	McBank_[1] = 1; Microcode_PC_Ld = 1							// Instuction Set 1; Instruction Decodeer Jump


#define D_ADD 0x4
#define D_COMPLIMENT 0x8
#define D_INCR 0x2
#define D_NOP 0x0
#define D_SUB 0x5
#define D_LT_0 0x9		// Done with a add opt and check carry?
#define D_EQ_0 0xA
#define D_GT_0 0xC


		//    01	Instruciton Set Bank
		//	     0000 binary instruction 0, 0x0 == OpJnS
	ORG		0b01_0000_0000
	mbr_Ld = 1; pc_out = 1 									// mbr = int(*pc)
	mar_Ld = 1; hand_out = 1; Memory_write = 1				// mar = int(hand); mem[mar] = mbr
	mbr_Ld = 1; hand_out = 1; ac_clr = 1					// mbr = int(hand)
	ac_inc = 1; 											// ac = 1
	ac_alu_out = 1; alu_ctl[1..4] = D_ADD; result_Ld = 1	// ac = ac + mbr
	ac_Ld = 1; result_out = 1
	microcode_pc_clr = 1						// Start of next instruction

		//    01	Instruciton Set Bank
		//	     0001 binary instruction 1, 0x1 == OpLoad
	ORG		0b01_0001_0000
	hand_out = 1; mdr_Ld = 1					// Move HAND -> MAR
	ac_Ld = 1; mdr_out = 1 						// Move MDR -> AC
	Microcode_PC_clr = 1											// Start of next instruction

		//    01	Instruciton Set Bank
		//	     0010 binary instruction 1, 0x2 == OpStore
	ORG		0b01_0010_0000
	hand_out = 1; mar_Ld = 1					// Move HAND -> MAR
	ac_out = 1; mdr_ld = 1; memory_write = 1 	// Move AC -> MDR
	Microcode_PC_clr = 1											// Start of next instruction

		//    01	Instruciton Set Bank
		//	     0011 binary instruction 3, 0x3 == OpAdd: 3 Tick
	ORG		0b01_0011_0000
	hand_out = 1; mar_Ld = 1; mdr_Ld = 1; memory_read = 1			// Move HAND -> MAR, Read Memory -> MDR
	ac_alu_out = 1; mdr_out = 1; alu_ctl[1..4] = D_ADD; result_Ld = 1	// AC output to ALU
	ac_Ld = 1; result_out = 1; Microcode_PC_clr = 1; 				// Move Result to AC; // Start of next instruction
								
	
		//   01	Instruciton Set Bank
		//	     0100 binary instruction 3, 0x3 == OpSubt       8+5 Tick = 13 Tick
	ORG		0b01_0100_0000
	hand_out = 1; mar_Ld = 1; mdr_Ld = 1; memory_read = 1			// Move HAND -> MAR, Read Memory -> MDR
	mdr_out = 1; alu_ctl[1..4] = D_COMPLIMENT; result_Ld = 1			// MDR output to ALU, 1st compliment
	mdr_Ld = 1; result_out = 1; 									// Move Result to MDR
	mdr_out = 1; alu_ctl[1..4] = D_INCR; result_Ld = 1				// MDR output to ALU, Incrment == 2s compliment
	mdr_Ld = 1; result_out = 1; 									// Move Result to MDR
	ac_alu_out = 1; mdr_out = 1; alu_ctl[1..4] = D_ADD; result_Ld = 1	// AC output to ALU
	ac_Ld = 1; result_out = 1; Microcode_PC_clr = 1; 				// Move Result to AC; // Start of next instruction
	
		//    01	Instruciton Set Bank
		//	     0111 binary instruction 7, 0x7 == OpHalt
	ORG		0b01_0111_0000
	McBank[0..9] = 0b01_0111_0000; Microcode_PC_Ld = 1		// Loop forever at same Microcode PC address.

		//    01	Instruciton Set Bank
		//	     1001 binary instruction 9, 0x9 == OpJump: 1 Tick
	ORG		0b01_1011_0000
	hand_out = 1; pc_Ld = 1; Microcode_PC_clr = 1;					// Load Operhand into PC
								
		//    01	Instruciton Set Bank
		//	     1010 binary instruction 10, 0xA == OpClear: 1 Tick
	ORG		0b01_1010_0000
	ac_clr = 1; Microcode_PC_clr = 1;								// Clear the AC
				



				
		//    01	Instruciton Set Bank
		//	     1000 binary instruction 8, 0x8 == OpSkipLt0, OpSkipEq0, OpSkipGt0: 4 Tick
	ORG		0b01_1000_0000
	McBank_[0..1] = 2; hand_out = 1; McBank_02 = hand[10], McBank_03 = hand[9]; Microcode_PC_Ld = 1							// Jumpt to bank 2 of microcode based on input fields in HAND

	// Load Microcode_PC with data

	ORG		0b10_1000_0000
	ac_alu_out = 1; alu_ctl[1..4] = D_LT_0; result_Ld = 1			// Compare AC lessthan 0
	pc_inc = result_eq_0
	
	ORG		0b10_1000_0100
	ac_alu_out = 1; alu_ctl[1..4] = D_NOP; result_Ld = 1			// Compare AC lessthan 0
	pc_inc = result_eq_0
	
	ORG		0b10_1000_1000
	ac_alu_out = 1; alu_ctl[1..4] = D_GT_0; result_Ld = 1			// Compare AC lessthan 0
	pc_inc = result_eq_0




	


<rect id="id_Microcode_PC_clr"
	
								
	OpJnS        = OpCodeType(0x0000) // JnS	-- Subroutine call:w
	*OpLoad       = OpCodeType(0x1000)
	*OpStore      = OpCodeType(0x2000)
	*OpAdd        = OpCodeType(0x3000)
	*OpSubt       = OpCodeType(0x4000)
	*OpHalt       = OpCodeType(0x7000)
	*OpJump       = OpCodeType(0x9000)
	*OpClear      = OpCodeType(0xA000)
	*OpSkipcond   = OpCodeType(0x8000)
	*OpSkipLt0    = OpCodeType(0x8000) // 00
	*OpSkipEq0    = OpCodeType(0x8400) // 01
	*OpSkipGt0    = OpCodeType(0x8800) // 10

// Add InputReg, OutputReg
	OpInput      = OpCodeType(0x5000)
	OpOutput     = OpCodeType(0x6000)


	OpAddI       = OpCodeType(0xB000)
	OpJumpI      = OpCodeType(0xc000)
	OpLoadI      = OpCodeType(0xd000)
	OpStoreI     = OpCodeType(0xe000)




// Note : 512 addresses in Microcode
		  16 Tick Max per Instruction w/ o a JUMP to a new set of code in a different bank.
		   5 Used to "setup"/"decode" an instruction (PC Overhead)
// Note :
	Add a "Tick" that is 1/16th of a Clock Cycle (Microcode Clock)
// Note :
	Add a "switch" to reset the MC PC  to 0, jump out of "HALT"

// Note :
	16bit and of Result - Compare to 0, True when 0 in Result
