# Code Table

<style>
table tbody tr td {
	font-size: 13px;
}
</style>
<table>
	<thead>
					<tr>
                        <th>Type</th>
                        <th>Instruction</th>
                        <th>Hex 0x, Binary 0b<br>Opcode</th>
                        <th>Description</th>
                    </tr>
	</thead>
	<tbody>
                    <tr>
                        <td rowspan="4">Arithmetic</td>
                        <td>Add X</td>
                        <td>0x3<br>0b0011</td>
                        <td>Adds value in AC at address X into AC, AC ← AC + X</td>
                    </tr>
                    <tr>
                        <td>Subt X</td>
                        <td>0x4<br>0b0100</td>
                        <td>Subtracts value in AC at address X into AC, AC ← AC - X</td>
                    </tr>
                    <tr>
                        <td>AddI X</td>
                        <td>0xB<br>0b1011</td>
                        <td>Add Indirect: Use the value at X as the actual address of the<br>data operand to add to AC</td>
                    </tr>
                    <tr>
                        <td>Clear</td>
                        <td>0xA<br>0b1010</td>
                        <td>AC ← 0</td>
                    </tr>
                    <tr>
                        <td rowspan="2">Data Transfer</td>
                        <td>Load X</td>
                        <td>0x1<br>0b0001</td>
                        <td>Loads Contents of Address X into AC</td>
                    </tr>
                    <tr>
                        <td>Store X</td>
                        <td>0x2<br>0b0010</td>
                        <td>Stores Contents of AC into Address X</td>
                    </tr>
                    <tr>
                        <td rowspan="2">Indirect Addressing</td>
                        <td>LoadI</td>
                        <td>0xE<br>0b1110</td>
                        <td>Loads value from indirect address into AC<br>e.g. LoadI address-pointer<br>Gets address value from address-pointer, loads value at the address into AC</td>
                    </tr>
                    <tr>
                        <td>StoreI</td>
                        <td>0xD<br>0b1101</td>
                        <td>Stores value in AC at the indirect address.<br>e.g. StoreI address-pointer<br>Gets value from address-pointer, stores the AC value into the address</td>
                    </tr>
                    <tr>
                        <td rowspan="2">I/O</td>
                        <td>Input</td>
                        <td>0x5<br>0b0101</td>
                        <td>Request user to input a value</td>
                    </tr>
                    <tr>
                        <td>Output</td>
                        <td>0x6<br>0b0110</td>
                        <td>Prints value from AC</td>
                    </tr>
                    <tr>
                        <td rowspan="2">Branch</td>
                        <td>Jump X</td>
                        <td>0x9<br>0b1001</td>
                        <td>Jumps to Address X</td>
                    </tr>
                    <tr>
                        <td>Skipcond (C) <br>
							SkipLt0 <br>
							SkipEq0 <br>
							SkipGt0 
							</td>
                        <td>0x8 Opcode <br>
							0x80 0b1000_0000 <br>
							0x84 0b1000_0100 <br>
							0x88 0x1000_1000 
							</td>
                        <td>Skips the next instruction based on C: if (C) = <br>
								- 000: Skips if AC &lt; 0<br>
								- 400: Skips if AC = 0<br>
								- 800: Skips if AC &gt; 0
							</td>
                    </tr>
                    <tr>
                        <td rowspan="2">Subroutine</td>
                        <td>JnS X</td>
                        <td>0x0<br> 0b0000</td>
                        <td>Jumps and Store: Stores value of PC at address X then increments PC to X+1</td>
                    </tr>
                    <tr>
                        <td>JumpI X</td>
                        <td>0xC<br>0b1100</td>
                        <td>Uses the value at X as the address to jump to</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Halt</td>
                        <td>0x7<br>0b0111</td>
                        <td>End the program<br>Stop Running Instructions</td>
                    </tr>
	</tbody>
</table>

