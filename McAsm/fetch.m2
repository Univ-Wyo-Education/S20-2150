
	DCL id_memory_Read id_memory_Write
	DCL	id_Microcode_PC_Clr id_Microcode_PC_Ld Microcode_PC_Ld2 id_Microcode_PC_Inc
	DCL ir_decode_g1 
	DCL	id_ac_Out_to_ALU id_ac_Clr id_ac_Inc id_ac_Ld id_ac_Out
	DCL McJmp_0 McJmp_1 McJmp_2 McJmp_3 McJmp_4 McJmp_5 McJmp_6 McJmp_7 
	DCL id_ALU_Ctl_0 id_ALU_Ctl_1 id_ALU_Ctl_2 id_ALU_Ctl_3
	DCL id_decoder_Ctl_0 id_decoder_Ctl_1
	DCL hand_out										
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
	id_decoder_Ctl_1 id_decoder_Ctl_0 	McJmp_7		id_ir_Out ir_decode_g1 		id_Microcode_PC_Ld 		// Instruction Set 1; Instruction Decoder Jump 0b11


	STR By Your Name......................






// -------------------- Instruction Execute (Implementation) --------------------------------------------------------------------------------------------------------------


// OpLoad, 0x1xxx => 0x88. 3+2 Ticks.
    ORG        0b1_0001_000														// 0x88
    hand_out id_ir_Out   id_mar_Ld 												set_execute id_Microcode_PC_Inc		// Move HAND -> MAR
	id_memory_Read																id_Microcode_PC_Inc					// 
    id_ac_Ld   id_mdr_Out                                       				ins_end id_Microcode_PC_Clr			// Move MDR -> AC 		// Start of next instruction

// OpStore, 0x2xxx => 0x90. 3+2 Ticks.
    ORG        0b1_0010_000														// 0x90
    hand_out   id_ir_Out id_mar_Ld                                    			set_execute id_Microcode_PC_Inc	// Move HAND -> MAR
    id_mdr_Ld   id_ac_Out                                       				id_Microcode_PC_Inc			    // Move AC -> MDR 
	id_memory_Write																ins_end id_Microcode_PC_Clr		// Write













// Jumps and Store: Stores value of PC at address X then increments PC to X+1
// OpJnS, 0x0xxx => 0x80.  3+6 Ticks.
    ORG        0b1_0000_000														// 0x80						
	// TODO

// OpAdd, 0x3xxx => 0x98. 3+3 Ticks.
    ORG        0b1_0011_000														// 0x98
	// TODO

// OpSubt, 0x4xxx => 0xA0. 3+3 Ticks.
    ORG        0b1_0100_000														// 0xA0
	// TODO

// OpInput, 0x5xxx => 0xA8. 3+1 Ticks.			
    ORG        0b1_0101_000														// 0xA8
	// TODO

// OpOutput, 0x6xxx => 0xA8. 3+1 Ticks.
    ORG        0b1_0110_000														// 0xB0
	// TODO

// OpHalt, 0x7xxx => 0xB0. 3+1 Ticks.
    ORG        0b1_0111_000														// 0xB8
	// TODO

// OpJump, 0x9xxx => 0xE8. 3+1 Ticks.
    ORG        0b1_1001_000														// 0xC8
	// TODO
                                
// OpClear, 0xAxxx => 0xD8. 3+1 Ticks.
    ORG        0b1_1010_000														// 0xD8
	// TODO

// OpLoadI, 0xD => 0xE8 address.  3+4 = 7 Ticks
	ORG			0b1_1101_000													// 0xE8
	// TODO

// OpStoreI 0xE, => 0xf8 address. Ticks 3+3
	ORG			0b1_1110_000													// 0xF0
	// TODO

// OpUnused 0xF, => 0xf8 address. ?forever?
	ORG			0b1_1111_000													// 0xF8
	// TODO

// OpAddI 0xB, => 0xf8 address. Ticks 3+5
	ORG			0b1_1011_000													// 0xd8
	// TODO

// OpJumpI 0xCxxx, => 0xE0
	ORG			0b1_1100_000													// 0xE0
	// TODO


// OpSkip[XXXX] --- OpSkipLt0, OpSkipEq0, OpSkipGt0: 3+3
    ORG        0b1_1000_000
	// TODO

    ORG        0b01_0000_00																				// 0x40
	// TODO
    
    ORG        0b01_0100_00																				// 0x50
	// TODO
    
    ORG        0b01_1000_00																				// 0x60
	// TODO

	ORG		   0b0010_0000																// 0x20 (no skip)
	// TODO

	ORG		   0b0010_0010																// 0x22 (skip)
	// TODO



__end__

// All of the stuff below this --  just comments -------------------------------------------------------------------------------------------------------------
   
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


### Again in different format
    
|   Op-Code       |     Hex Representation       |
| ----------------|------------------------------|                           
|      JnS        |     0x0000                   |
|      Load       |     0x1000                   |
|      Store      |     0x2000                   |
|      Add        |     0x3000                   |
|      Subt       |     0x4000                   |
|      Halt       |     0x7000                   |
|      Jump       |     0x9000                   |
|      Clear      |     0xA000                   |
|      Skipcond   |     0x8000                   |
|      SkipLt0    |     0x8000 // 00             |
|      SkipEq0    |     0x8400 // 01             |
|      SkipGt0    |     0x8800 // 10             |
|                 |                              |
|      Input      |     0x5000                   |
|      Output     |     0x6000                   |
|                 |                              |
|      AddI       |     0xB000                   |
|      JumpI      |     0xc000                   |
|      LoadI      |     0xd000                   |
|      StoreI     |     0xe000                   |






 
## Our ALU has 4 control inputs.

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


    
