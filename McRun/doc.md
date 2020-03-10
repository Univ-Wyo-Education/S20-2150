#  Signal Lines

## McJmp_0 McJmp_1 McJmp_2 McJmp_3 McJmp_4 McJmp_5 McJmp_6 McJmp_7

These 8 lines are combined with other inputs to allow for a computed-goto jump using the Microcode_PC.  Basically output 
the true lines, McJmp_7 for example, and combine this with id_decode_g1 and id_ir_Out to send to the MUX (Decoder) the input
necessary to the primary decode of an instruction.  Select 11 as the MUX inputs control using
id_decoder_Ctl_0 and id_decoder_Ctl_1 and turn on the load signal to the Microcode_PC register.  This jumps from the 
instruction fetch to the individual instruction execute code.

## do_input 45
## do_output 46

## hand_out 26

## id_ALU_Ctl 44
## id_ALU_Ctl_0 20
## id_ALU_Ctl_1 21
## id_ALU_Ctl_2 22
## id_ALU_Ctl_3 23

## id_Microcode_PC_Clr 2
## id_Microcode_PC_Inc 5
## id_Microcode_PC_Ld 3

## id_ac_Clr 8
## id_ac_Inc 9
## id_ac_Ld 10
## id_ac_Out 11
## id_ac_Out_to_ALU 7

## id_decoder_Ctl_0 24
## id_decoder_Ctl_1 25

## id_input_Out 27

## id_ir_Ld 28
## id_ir_Out 29

## id_mar_Ld 30
## id_mar_Out 31

## id_mdr_Ld 32
## id_mdr_Out 33

## id_memory_Read 0
## id_memory_Write 1

## id_output_Ld 34

## id_pc_Inc 35
## id_pc_Ld 36
## id_pc_Out 37

## id_result_Ld 38
## id_result_Out 39

## ins_end 43

## ir_decode_g1 6

## is_fetch 41

## is_halted 40

## set_execute 42
