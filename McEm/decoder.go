package main

// Decodeer

// 2 control lines = 4 inputs.

// 8 bits wide, so

// 8 * 4		input
// 8            output to Microcode PC
// 2			Control
// =========
// 32			wires + 2

// Input 0  - Pass 8 bits of address data from Microcode Out back to Microcode PC In. (Jump to Address)
// Input 1	- connected to 4 bits of IR register, high bit is +5, low 3 = 0 -- Primary Instruction Decode
// Input 2 	- 2ndary Decode of 4 bits of IR when 0x8000 is instruction. high[2] = 01, 4 bits decode, low 2 = 0
// Input 3 	- connect Result - IsZero to high[3] = 001 [IsZero] 0000
