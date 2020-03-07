
	DCL id_memory_Read id_memory_Write
	DCL	id_Microcode_PC_Clr id_Microcode_PC_Ld Microcode_PC_Ld2 id_Microcode_PC_Inc
	DCL ir_decode_g1 
	DCL	id_ac_Out_to_ALU id_ac_Clr id_ac_Inc id_ac_Ld id_ac_Out
	DCL McJmp_0 McJmp_1 McJmp_2 McJmp_3 McJmp_4 McJmp_5 McJmp_6 McJmp_7 
	DCL id_ALU_Ctl_0 id_ALU_Ctl_1 id_ALU_Ctl_2 id_ALU_Ctl_3
	DCL id_decoder_Ctl_0 id_decoder_Ctl_1
	DCL hand_out										// Shifts Over 4, 12 of 16 bits.
	DCL id_input_Out
	DCL id_ir_Ld id_ir_Out
	DCL id_mar_Ld id_mar_Out
	DCL id_mdr_Ld id_mdr_Out
	DCL id_output_Ld
	DCL id_pc_Inc id_pc_Ld id_pc_Out
	DCL id_result_Ld id_result_Out

	DCL is_halted is_fetch set_execute ins_end id_ALU_Ctl do_input do_output 

// -------------------- Instruction Fetch Cycle ------------------------------------------------------------------------------------------------------------------------

// Decode 1st nibble of instruction
// Move Instruction from Main Memory to IR
// 3 Tick
    ORG        0b0_0000_000														// 0x00
    id_mar_Ld id_pc_Out 														is_fetch id_Microcode_PC_Inc
    id_mdr_Out id_pc_Inc  id_memory_Read 										id_Microcode_PC_Inc
	id_ir_Ld id_mdr_Out															id_Microcode_PC_Inc
	id_decoder_Ctl_1 id_decoder_Ctl_0 	McJmp_7		id_ir_Out ir_decode_g1 		id_Microcode_PC_Ld 		// Instuction Set 1; Instruction Decodeer Jump 0b11


	STR By Prof. Philip Schlump v0.1.2


// -------------------- Instruction Implementation ---------------------------------------------------------------------------------------------------------------------

// OpJnS, 0x0xxx => 0x80.  3+6 Ticks.
    ORG        0b1_0000_000														// 0x80						
    id_mdr_Ld   id_pc_Out  														set_execute id_Microcode_PC_Inc 	// mdr = int(pc)
    id_mar_Ld   hand_out   id_ir_Out id_memory_Write   							id_Microcode_PC_Inc 				// mar = int(hand); mem[mar] = mdr
    id_mdr_Ld   hand_out   id_ir_Out id_ac_Clr   								id_Microcode_PC_Inc 				// mdr = int(hand)
    id_ac_Inc   																id_Microcode_PC_Inc 				// ac = ac + 1
    id_ac_Out_to_ALU   id_ALU_Ctl_2 id_result_Ld  								id_Microcode_PC_Inc 				// ac = ac + mdr (id_ALU_Ctl[4] = 0x4)
    id_ac_Ld   id_result_Out 													ins_end id_Microcode_PC_Clr 		// ?  					// Start of next instruction

// OpLoad, 0x1xxx => 0x88. 3+2 Ticks.
    ORG        0b1_0001_000														// 0x88
    hand_out id_ir_Out   id_mar_Ld 												set_execute id_Microcode_PC_Inc		// Move HAND -> MAR
																				// should trigger
																				// 	, { Name:"MAR", Op:["Out_to_Memory"] }
																				// 	, { Name:"MDR", Op:["From_Memory_to_MDR"] }		
																				// MEMORY.msg("Read",1);			// Setup MAR to do a load.
																				// MAR.msg("Out",1);
																				// MDR.msg("From_Memory_to_MDR",1);
	id_memory_Read																id_Microcode_PC_Inc					// 
    id_ac_Ld   id_mdr_Out                                       				ins_end id_Microcode_PC_Clr			// Move MDR -> AC 		// Start of next instruction

// OpStore, 0x2xxx => 0x90. 3+2 Ticks.
    ORG        0b1_0010_000														// 0x90
    hand_out   id_ir_Out id_mar_Ld                                    			set_execute id_Microcode_PC_Inc		// Move HAND -> MAR
    id_mdr_Ld   id_ac_Out                                       				ins_end id_Microcode_PC_Inc			// Move AC -> MDR 
	id_memory_Write																ins_end id_Microcode_PC_Clr			// Write


// OpAdd, 0x3xxx => 0x98. 3+3 Ticks.
    ORG        0b1_0011_000														// 0x98
    hand_out   id_ir_Out id_mar_Ld   							             	set_execute id_Microcode_PC_Inc		// Move HAND -> MAR
    id_mdr_Ld   id_memory_Read             										id_Microcode_PC_Inc					// Read Memory -> MDR
    id_ac_Out_to_ALU   id_mdr_Out   id_ALU_Ctl id_ALU_Ctl_2  id_result_Ld      			id_Microcode_PC_Inc					// AC output to ALU (id_Alu_Ctl[4]=0x4)
    id_ac_Ld   id_result_Out   													ins_end id_Microcode_PC_Clr			// Move Result to AC; // Start of next instruction

// OpSubt, 0x4xxx => 0xA0. 3+3 Ticks.
    ORG        0b1_0100_000														// 0xA0
    hand_out   id_ir_Out id_mar_Ld   							             	set_execute id_Microcode_PC_Inc		// Move HAND -> MAR
    id_mdr_Ld   id_memory_Read             										id_Microcode_PC_Inc					// Read Memory -> MDR
    id_ac_Out_to_ALU   id_mdr_Out   id_ALU_Ctl id_ALU_Ctl_2 id_ALU_Ctl_0 id_result_Ld      			id_Microcode_PC_Inc					// AC output to ALU (id_Alu_Ctl[4]=0x5)
    id_ac_Ld   id_result_Out   													ins_end id_Microcode_PC_Clr			// Move Result to AC; // Start of next instruction

// OpInput, 0x5xxx => 0xA8. 3+1 Ticks.			
    ORG        0b1_0101_000														// 0xA8
	id_ac_Ld id_input_Out 			do_input									set_execute ins_end id_Microcode_PC_Clr

// OpOutput, 0x6xxx => 0xA8. 3+1 Ticks.
    ORG        0b1_0110_000														// 0xB0
	id_ac_Out id_output_Ld 			do_output									set_execute ins_end id_Microcode_PC_Clr

// OpHalt, 0x7xxx => 0xB0. 3+1 Ticks.
    ORG        0b1_0111_000														// 0xB8
    McJmp_4 McJmp_5 McJmp_7 		is_halted							set_execute ins_end id_Microcode_PC_Ld		// Decoder 0b00 ; Output Address To Self - Loop Forever, decoder address 0

// OpJump, 0x9xxx => 0xE8. 3+1 Ticks.
    ORG        0b1_1001_000														// 0xC8
    hand_out   id_ir_Out id_pc_Ld   											set_execute ins_end id_Microcode_PC_Clr     // Load Operhand into PC
                                
// OpClear, 0xAxxx => 0xD8. 3+1 Ticks.
    ORG        0b1_1010_000														// 0xD8
    id_ac_Clr   																set_execute ins_end id_Microcode_PC_Clr     // Clear the AC

// OpLoadI, 0xD => 0xE8 address.  3+4 = 7 Ticks
	ORG			0b1_1101_000													// 0xE8
    id_mar_Ld hand_out id_ir_Out 												set_execute id_Microcode_PC_Inc			// mar = int(hand) 
    id_memory_Read  id_mdr_Ld   							              		id_Microcode_PC_Inc						// mdr = mem[mar]
	id_mar_Ld id_mdr_Out                                      					id_Microcode_PC_Inc						// mar = mdr
	id_memory_Read id_mdr_Ld                                        			id_Microcode_PC_Inc						// mdr = mem[mar]
    id_ac_Ld id_mdr_Out 														ins_end id_Microcode_PC_Clr			    // AC <- mdr

// OpStoreI 0xE, => 0xf8 address. Ticks 3+3
	ORG			0b1_1110_000													// 0xF8
    id_mar_Ld hand_out id_ir_Out id_memory_Read  id_mdr_Ld id_Microcode_PC_Inc  set_execute id_Microcode_PC_Inc			// mar = int(hand) ; mdr = mem[mar]
	id_mar_Ld id_mdr_Out  id_Microcode_PC_Inc        							id_Microcode_PC_Inc						// mar = mdr
	id_memory_Write  id_mdr_Out 												ins_end id_Microcode_PC_Clr    			// mem[mar] = mdr

// OpUnused 0xF, => 0xf8 address. ?forever?
	ORG			0b1_1111_000													// 0xF8
	//    McJmp_4 McJmp_5 McJmp_7 										id_Microcode_PC_Ld						// Mux 0b00 ; Output Address To Halt - Loop Forever, decoder address 0

// OpAddI 0xE, => 0xf8 address. Ticks 3+5
	ORG			0b1_1110_000													// 0xF0
    id_mar_Ld hand_out id_ir_Out id_memory_Read  id_mdr_Ld                 		set_execute id_Microcode_PC_Inc			// mar = int(hand) ; mdr = mem[mar]
	id_mar_Ld id_mdr_Out                                      					id_Microcode_PC_Inc						// mar = mdr
	id_memory_Read                                         						id_Microcode_PC_Inc						// mdr = mem[mar]
    id_ac_Out_to_ALU   id_mdr_Out   id_ALU_Ctl id_ALU_Ctl_2  id_result_Ld         			id_Microcode_PC_Inc						// AC output to ALU
    id_ac_Ld   id_result_Out   													ins_end id_Microcode_PC_Clr     		// Move Result to AC; ac = Result; // Start of next instruction 


// OpJumpI 0xCxxx, => 0xE0
	ORG			0b1_1100_000													// 0xE0
    id_mar_Ld hand_out id_ir_Out id_memory_Read  id_mdr_Ld                		set_execute id_Microcode_PC_Inc			// mar = int(hand) ; mdr = mem[mar]
	id_mar_Ld id_mdr_Out                                      					id_Microcode_PC_Inc						// mar = mdr
	id_memory_Read id_mdr_Ld                                  					id_Microcode_PC_Inc						// mdr = mem[mar]
    id_pc_Ld id_mdr_Out 														ins_end id_Microcode_PC_Clr     		// PC <- mdr








	// id_decoder_Ctl_1 id_decoder_Ctl_0 	McJmp_7		id_ir_Out ir_decode_g1 		id_Microcode_PC_Ld 		// Instuction Set 1; Instruction Decodeer Jump 0b11


// OpSkip[XXXX] --- OpSkipLt0, OpSkipEq0, OpSkipGt0: 3+3
    ORG        0b1_1000_000
//x    McJmp_6 id_result_Out id_decoder_Ctl_1    id_ir_Out ir_decode_g2  				set_execute id_Microcode_PC_Ld 		// Jumpt to bank 0 of microcode based on input fields. decoder_ctl = 0b10
    McJmp_6 id_ir_Out id_decoder_Ctl_1      											id_Microcode_PC_Ld 		// Jumpt to bank 0 of microcode based on input fields. decoder_ctl = 0b10
																						// Take bits 8, 9, 10, 11 of the hand -> decoder | McJmp_10 and McJmp_9 Jump to Below Ops

    ORG        0b01_0000_00																				// 0x40
    id_ac_Out_to_ALU   id_ALU_Ctl id_ALU_Ctl_3 id_ALU_Ctl_0 id_result_Ld McJmp_5 	id_decoder_Ctl_0	id_Microcode_PC_Ld		// Compare AC lessthan 0 (ALU LT 0)
    
    ORG        0b01_0100_00																				// 0x50
    id_ac_Out_to_ALU    id_result_Ld McJmp_5  id_decoder_Ctl_0 											id_Microcode_PC_Ld		// Compare AC lessthan 0 -- Alu with 0 control is NOP (decoder_ctl = 0b01) - Compare IsZero
    
    ORG        0b01_1000_00																				// 0x60
    id_ac_Out_to_ALU   id_ALU_Ctl id_ALU_Ctl_3 id_ALU_Ctl_2 id_result_Ld McJmp_5   id_decoder_Ctl_0   	id_Microcode_PC_Ld		// Compare AC lessthan 0 (ALU GT 0xC)	 ( MC goto 0x10 )




// xyzzy - this is wrong!
	ORG		   0b0001_0000																// 0x10
	id_result_Out id_decoder_Ctl_0 McJmp_5 McJmp_4 										id_Microcode_PC_Ld		// Use Zero Compare on MUX




	ORG		   0b0010_0000																// 0x20 (no skip)
    																					ins_end id_Microcode_PC_Clr                           			
	ORG		   0b0010_0010																// 0x22 (skip)
	id_pc_Inc 																			ins_end id_Microcode_PC_Clr                           			



	//                  v
	ORG		   0b0001_1000																// 0x18
	id_pc_Inc 																			ins_end id_Microcode_PC_Clr
	ORG		   0b0001_1010																// 0x1A
    																					ins_end id_Microcode_PC_Clr                           			



__end__
   
## Decoer Inputs
	CTL		Line/Instruction
	00		82,124	/ Microcode Jmp (Halt, Unused)
	01		138,144,150 / Jump if (Is Zero) from Result/Cmp - Microcode PC Inc Twice
	10		133 / OkSkip { OkSkipEe0, OkSkipGt0, OkSkipLt0 }
	11		22  / Common IR Decode



## Instructions

xxx is the 12 bits of `hand`.

| Op      | Hex Code   | Implemented by       |
|----------:|---------:|:---------------------|
| JnS       | 0x0xxx   | mdr = pc             |
|           |          | mar = hand           |
|           |          | mem[mar] = mdr       |
|           |          | ac = hand            |
|           |          | ac = ac + 1          |
|           |          | pc = ac              |
| Load      | 0x1xxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | ac = mdr             |
| Store     | 0x2xxx   | mar = hand	          |
|           |          | mdr = ac             |
|           |          | mem[mar] = mdr       |
| Add       | 0x3xxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | ac = ac + mdr        |
| Subt      | 0x4xxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | ac = ac - mdr        |
| Input     | 0x5000   | Input Reg ⟸  ⟸       |
| Output    | 0x6000   | Output Reg ⟹         |
| Halt      | 0x7000   | Do Nothing           |


| Op      | Hex Code   | Implemented by       |
|----------:|---------:|:---------------------|
| Skipcond  | 0x8y00   | see below            |
| &nbsp;Lt0 | y == 0x0 | if ac >= 0, pc += 1  |
| &nbsp;Eq0 | y == 0x4 | if ac == 0, pc += 1  |
| &nbsp;Gt0 | y == 0x8 | if ac <= 0, pc += 1  |
| Jump      | 0x9xxx   | pc = hand            |
| Clear     | 0xA000   | ac = 0               |
| AddI      | 0xBxxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | mar = mdr            |
|           |          | mdr = mem[mar]       |
|           |          | ac = ac + mdr        |
| JumpI     | 0xCxxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | pc = mdr             |
| LoadI     | 0xDxxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | mar = mdr            |
|           |          | mdr = mem[mar]       |
|           |          | ac = mdr             |
| StoreI    | 0xExxx   | mar = hand           |
|           |          | mdr = mem[mar]       |
|           |          | mar = mdr            |
|           |          | mdr = ac             |
|           |          | mem[mar] = mdr       |


 
Our ALU has 4 control inputs.

| i3 | i2 | i1 | i0 | Used   | Action Taken                                          |
|:--:|:--:|:--:|:--:|:------:|:------------------------------------------------------|
|  0 | 0  |  0 |  0 |    *   |  2s Compliment                                        |
|  0 | 0  |  0 |  1 |        |                                                       |
|  0 | 0  |  1 |  0 |    *   |  Increment by 1, ac + 1 -> Result                     |
|  0 | 0  |  1 |  1 |        |  Decrement by 1, 2s compliment, result = ac - 1       |
|  0 | 1  |  0 |  0 |    *   |	Add: result = ac + bus (mdr usually)                 |
|  0 | 1  |  0 |  1 |    *   |  Sub: subtract A - B                                  |
|  0 | 1  |  1 |  0 |        |  A >> B - Arithmetic - fills with MSB                 |
|  0 | 1  |  1 |  1 |    *   |  A == B - if A == B, result <- 1                      |
|  1 | 0  |  0 |  0 |        |  Compliment: Toggle each bit in result = ^ac          |
|  1 | 0  |  0 |  1 |  9 *   |  1 if AC less than 0, 2s compliment                   |
|  1 | 0  |  1 |  0 |  A *   |  1 if AC greater than 0, 2s compliment                |
|  1 | 0  |  1 |  1 |  B     |  A and B                                              |
|  1 | 1  |  0 |  0 |  C     |  A or B                                               |
|  1 | 1  |  0 |  1 |  D     |  A xor B                                              |
|  1 | 1  |  1 |  0 |  E     |  A >> B - logical - 0 fill   - Shift Right            |
|  1 | 1  |  1 |  1 |  F     |  A << B - logical - 0 fill   - Shift Left             |













    
                                
    +OpJnS        = OpCodeType(0x0000) // JnS    -- Subroutine call:w
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
    *OpInput      = OpCodeType(0x5000)
    *OpOutput     = OpCodeType(0x6000)


    *OpAddI       = OpCodeType(0xB000)
    *OpJumpI      = OpCodeType(0xc000)
    *OpLoadI      = OpCodeType(0xd000)
    *OpStoreI     = OpCodeType(0xe000)




// Note : 256 addresses in Microcode
Microcode is 256 (2**8) of 64 wide storage.

// Note :
    Add a "switch" to reset the MC PC  to 0, jump out of "HALT"

