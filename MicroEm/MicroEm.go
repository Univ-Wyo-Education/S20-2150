package main

import (
	"fmt"
	"os"
)

// microcode emulator in Go

/// ==============================================================================================================================================================
// xyzzyALU
// xyzzy - ALU - 8bit ALU 4 in function, 1 out, Result, A-input/B-input = 2 input * 8 = 16, 16+4+(2)+8 = 24+6 = 30 (Cin, Cout) = 32 pin

/// ==============================================================================================================================================================
// xyzzy - Decode Instruction ( 0x0 -> 0xf (main) ) + 2 bits = 6bit Address
// TODO - Not 04
// TODO - Nor 02
// TODO - 4 input AND (Decode 0x8 -> True signal with 3*Not + 4-input AND) -> Input
// TODO - 4bit PC for M-PC counter.

// done - Microcode Memory ( 8 address - 64 bit wide output = 256 instructions, 64 wide ) (2x32 wide)

/// ==============================================================================================================================================================

type ConnectionType struct {
	ChipNo int
	Pin    []int
}

type ChipType struct {
	ChipNo int
}

var WireDiagram []ConnectionType

var ChipsLayout []ChipType

// ==============================================================================================================================================================
// ==============================================================================================================================================================
// Chip
// -------------
// This is the inteface that describes a "Chip" or "Module" in our system.
// ==============================================================================================================================================================
// ==============================================================================================================================================================

type Chip interface {
	Description() (string, string)
	GetInputs() []int
	GetOutputs() []int
	GetVccGnd() (int, int)
	GetNPins() int
	Behave() // Run 1 clock cycle given current inputs
}

// ==============================================================================================================================================================
// Ls7400 Nand
// ==============================================================================================================================================================
type Ls7400 struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
}

func NewLs7400(loc string) Chip {
	return &Ls7400{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    16,
		Vcc:      14,
		Gnd:      7,
		Inputs:   []int{1, 2, 4, 5, 13, 12, 10, 9},
		Outputs:  []int{3, 6, 11, 8},
	}
}

func (cp *Ls7400) Description() (string, string) {
	return "74ls00 4 Nand Gate", "./chip/ls7400.html"
}
func (cp *Ls7400) GetNPins() int {
	return cp.NPins
}

func (cp *Ls7400) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls7400) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls7400) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls7400) Behave() {
	fx := func(p1, p2, p3 int) {
		a1 := cp.Wire2.Get(p1)
		a2 := cp.Wire2.Get(p2)
		o1 := int(^uint(a1 & a2))
		cp.Wire2.Set(o1, p3)
	}
	fx(1, 2, 3)
	fx(4, 5, 6)
	fx(13, 12, 11)
	fx(10, 9, 8)
}

/// ==============================================================================================================================================================
/// Ls74_Mux 4 bit
// 4 input mux, 4 bits.
/// ==============================================================================================================================================================
type Ls74_Mux struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
}

func NewLs74_Mux(loc string) Chip {
	return &Ls74_Mux{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    24,
		Vcc:      24,
		Gnd:      12,
		Inputs: []int{1, 2, // Control Lines, 00, 01, 10, 11
			7, 8, 9, 10, // A input == 00
			11, 13, 14, 15, // B input == 01
			16, 17, 18, 19, // C input == 10
			20, 21, 22, 23, // D input == 11
		},
		Outputs: []int{3, 4, 5, 6},
	}
}

func (cp *Ls74_Mux) Description() (string, string) {
	return "4 Bit Mux", "./chip/mux4bit.html"
}
func (cp *Ls74_Mux) GetNPins() int {
	return cp.NPins
}

func (cp *Ls74_Mux) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls74_Mux) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls74_Mux) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls74_Mux) Behave() {
	ctl := (cp.Wire2.Get(1) << 1) | cp.Wire2.Get(2)
	var x int
	switch ctl {
	case 0:
		x = cp.Wire2.Get(7)
		cp.Wire2.Set(3, x)
		x = cp.Wire2.Get(8)
		cp.Wire2.Set(4, x)
		x = cp.Wire2.Get(9)
		cp.Wire2.Set(5, x)
		x = cp.Wire2.Get(10)
		cp.Wire2.Set(6, x)
	case 1:
		x = cp.Wire2.Get(11)
		cp.Wire2.Set(3, x)
		x = cp.Wire2.Get(13)
		cp.Wire2.Set(4, x)
		x = cp.Wire2.Get(14)
		cp.Wire2.Set(5, x)
		x = cp.Wire2.Get(15)
		cp.Wire2.Set(6, x)
	case 2:
		x = cp.Wire2.Get(16)
		cp.Wire2.Set(3, x)
		x = cp.Wire2.Get(17)
		cp.Wire2.Set(4, x)
		x = cp.Wire2.Get(18)
		cp.Wire2.Set(5, x)
		x = cp.Wire2.Get(19)
		cp.Wire2.Set(6, x)
	case 3:
		x = cp.Wire2.Get(20)
		cp.Wire2.Set(3, x)
		x = cp.Wire2.Get(21)
		cp.Wire2.Set(4, x)
		x = cp.Wire2.Get(22)
		cp.Wire2.Set(5, x)
		x = cp.Wire2.Get(23)
		cp.Wire2.Set(6, x)
	}
}

/// ==============================================================================================================================================================
/// Ls74_Reg_File 4 bit
// Register - File ( 8 registers )		3 address, 8 in, 8 out, inc in, Vcc/Gnd = 20 pin
/// ==============================================================================================================================================================
type Ls74_Reg_File struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
	data     []int
}

func NewLs74_Reg_File(loc string) Chip {
	return &Ls74_Reg_File{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    26,
		Vcc:      26,
		Gnd:      13,
		Inputs: []int{1, 2, 3, 4, 5, 6, 7, 8, // Inputs
			9, 10, 11, // Address to apply to
			12,  // Increment
			14,  // Clear
			23,  // Load
			24,  // Complement
			25}, // Set-to-1
		Outputs: []int{15, 16, 17, 18, 19, 20, 21, 22}, // Outputs
		data:    make([]int, 8),
	}
}

func (cp *Ls74_Reg_File) Description() (string, string) {
	return "8 Addres / 8 Bit Register File", "./chip/reg_file_8x8.html"
}
func (cp *Ls74_Reg_File) GetNPins() int {
	return cp.NPins
}

func (cp *Ls74_Reg_File) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls74_Reg_File) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls74_Reg_File) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls74_Reg_File) Behave() {
	addr := cp.Wire2.Get(9)<<2 | cp.Wire2.Get(10)<<1 | cp.Wire2.Get(11)
	no, ni := 0, 0
	if cp.Wire2.Get(23) != 0 { // Load
		ni = cp.Wire2.Get(1)<<7 | cp.Wire2.Get(2)<<6 | cp.Wire2.Get(3)<<5 | cp.Wire2.Get(4)<<4 | cp.Wire2.Get(5)<<3 | cp.Wire2.Get(6)<<2 | cp.Wire2.Get(7)<<1 | cp.Wire2.Get(8)
		no = ni
		cp.data[addr] = no
	}
	if cp.Wire2.Get(14) != 0 { // Clear
		no = 0
		cp.data[addr] = no
	}
	if cp.Wire2.Get(25) != 0 { // Set to 1
		no = 1
		cp.data[addr] = no
	}
	if cp.Wire2.Get(24) != 0 { // Compliment
		ni = cp.data[addr]
		no = (^ni) & 0xff
		cp.data[addr] = no
	}
	if cp.Wire2.Get(12) != 0 { // Increment
		ni = cp.data[addr]
		no = (ni + 1) & 0xff
		cp.data[addr] = no
	}
	pp := cp.data[addr]
	cp.Wire2.Set(15, (pp>>7)&0x1)
	cp.Wire2.Set(16, (pp>>6)&0x1)
	cp.Wire2.Set(17, (pp>>5)&0x1)
	cp.Wire2.Set(18, (pp>>4)&0x1)
	cp.Wire2.Set(19, (pp>>3)&0x1)
	cp.Wire2.Set(20, (pp>>2)&0x1)
	cp.Wire2.Set(21, (pp>>1)&0x1)
	cp.Wire2.Set(22, pp&0x1)
}

/// ==============================================================================================================================================================
/// Ls74_2k_Mem 4 bit
// Memory module, 2k - 8bit - SRAM
/// ==============================================================================================================================================================
type Ls74_2k_Mem struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
	data     []int
}

func NewLs74_2k_Mem(loc string) Chip {
	return &Ls74_2k_Mem{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    30,
		Vcc:      30,
		Gnd:      15,
		Inputs: []int{1, 2, 3, 4, 5, 6, 7, 8, // Inputs
			9, 10, 11, 12, 13, 14, 24, 25, 26, 27, 28, // Address to apply to (2**11)
			29}, // Load
		Outputs: []int{16, 17, 18, 19, 20, 21, 22, 23}, // Outputs
		data:    make([]int, 2048),
	}
}

func (cp *Ls74_2k_Mem) Description() (string, string) {
	return "2k Memory - 8 bit", "./chip/2k-8bit-SRam.html"
}

func (cp *Ls74_2k_Mem) GetNPins() int {
	return cp.NPins
}

func (cp *Ls74_2k_Mem) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls74_2k_Mem) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls74_2k_Mem) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls74_2k_Mem) Behave() {
	addr := cp.Wire2.Get(9)<<10 |
		cp.Wire2.Get(10)<<9 |
		cp.Wire2.Get(11)<<8 |
		cp.Wire2.Get(12)<<7 |
		cp.Wire2.Get(13)<<6 |
		cp.Wire2.Get(14)<<5 |
		cp.Wire2.Get(24)<<4 |
		cp.Wire2.Get(25)<<3 |
		cp.Wire2.Get(26)<<2 |
		cp.Wire2.Get(27)<<1 |
		cp.Wire2.Get(28)

	no, ni := 0, 0
	if cp.Wire2.Get(23) != 0 { // Load
		ni = cp.Wire2.Get(1)<<7 | cp.Wire2.Get(2)<<6 | cp.Wire2.Get(3)<<5 | cp.Wire2.Get(4)<<4 | cp.Wire2.Get(5)<<3 | cp.Wire2.Get(6)<<2 | cp.Wire2.Get(7)<<1 | cp.Wire2.Get(8)
		no = ni
		cp.data[addr] = no
	}
	pp := cp.data[addr]
	cp.Wire2.Set(16, (pp>>7)&0x1)
	cp.Wire2.Set(17, (pp>>6)&0x1)
	cp.Wire2.Set(18, (pp>>5)&0x1)
	cp.Wire2.Set(19, (pp>>4)&0x1)
	cp.Wire2.Set(20, (pp>>3)&0x1)
	cp.Wire2.Set(21, (pp>>2)&0x1)
	cp.Wire2.Set(22, (pp>>1)&0x1)
	cp.Wire2.Set(23, pp&0x1)
}

/// ==============================================================================================================================================================
/// Ls74_Fast_Rom - Microcode Store
// Memory module, Wide memory (32bit out)
/// ==============================================================================================================================================================
type Ls74_Fast_Rom struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
	Data     []uint64
}

func NewLs74_Fast_Rom(loc string) Chip {
	return &Ls74_Fast_Rom{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    44,
		Vcc:      44,
		Gnd:      22,
		Inputs: []int{
			1, 2, 3, 4, 5, 6, 7, 8, // Address to apply to
			43, // SIO - Input (not implemented)
			9}, // Re-Burn (Load) (not implemented)
		Outputs: []int{
			10, 11, 12, 13, 14, 15, 16, 17,
			18, 19, 20, 21, 23, 24, 25, 26,
			27, 28, 29, 30, 31, 32, 33, 34,
			35, 36, 37, 38, 39, 40, 41, 42,
		},
		Data: make([]uint64, 256),
	}
}

func (cp *Ls74_Fast_Rom) Description() (string, string) {
	return "256 words of 32 bits", "./chip/Fast_Rom.html"
}

func (cp *Ls74_Fast_Rom) GetNPins() int {
	return cp.NPins
}

func (cp *Ls74_Fast_Rom) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls74_Fast_Rom) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls74_Fast_Rom) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls74_Fast_Rom) Behave() {
	addr := cp.Wire2.Get(1)<<7 |
		cp.Wire2.Get(2)<<6 |
		cp.Wire2.Get(3)<<5 |
		cp.Wire2.Get(4)<<4 |
		cp.Wire2.Get(5)<<3 |
		cp.Wire2.Get(6)<<2 |
		cp.Wire2.Get(7)<<1 |
		cp.Wire2.Get(8)

	//no, ni := 0, 0
	//if cp.Wire2.Get(23) != 0 { // Load -- xyzzy
	//	ni = cp.Wire2.Get(1)<<7 | cp.Wire2.Get(2)<<6 | cp.Wire2.Get(3)<<5 | cp.Wire2.Get(4)<<4 | cp.Wire2.Get(5)<<3 | cp.Wire2.Get(6)<<2 | cp.Wire2.Get(7)<<1 | cp.Wire2.Get(8)
	//	no = ni
	//	cp.Data[addr] = no
	//}
	pp := cp.Data[addr]
	for ii := range cp.Outputs {
		pin := cp.Outputs[31-ii] // go through in reverse order
		cp.Wire2.Set(pin, int(pp&0x1))
		pp >>= 1
	}
}

/// ==============================================================================================================================================================
// xyzzyALU
/// ==============================================================================================================================================================
type Ls74_ALU_8bit struct {
	Location string
	NPins    int
	Vcc      int
	Gnd      int
	Inputs   []int
	Outputs  []int
	Wire2    Wire
}

func NewLs74_ALU_8bit(loc string) Chip {
	return &Ls74_ALU_8bit{
		Location: loc,
		Wire2:    NewWireImpl("", "", 0),
		NPins:    40, // 16 + 8 + 5 + 2 + 2, +...
		Vcc:      40,
		Gnd:      20,
		Inputs: []int{
			1, 2, 3, 4, 5, 6, 7, 8, // Inputs A
			1, 2, 3, 4, 5, 6, 7, 8, // Inputs B
			9, 10, 11, 00, 00, // Function to Perform (See Table) (32 functions) // 1 bit is Logic v.s. Arithmetic
			00, // Carry In
		},
		Outputs: []int{
			15, 16, 17, 18, 19, 20, 21, 22, // Outputs C
			00, // Carry out
		}, // Outputs
	}
}

func (cp *Ls74_ALU_8bit) Description() (string, string) {
	return "8 bit cascade-able able ALU", "./chip/8bit-ALU.html"
}
func (cp *Ls74_ALU_8bit) GetNPins() int {
	return cp.NPins
}

func (cp *Ls74_ALU_8bit) GetInputs() []int {
	return cp.Inputs
}

func (cp *Ls74_ALU_8bit) GetOutputs() []int {
	return cp.Outputs
}

func (cp *Ls74_ALU_8bit) GetVccGnd() (int, int) {
	return cp.Vcc, cp.Gnd
}

func (cp *Ls74_ALU_8bit) Behave() {
	// xyzzy -
	operation := cp.Wire2.Get(9)<<4 |
		cp.Wire2.Get(9)<<3 |
		cp.Wire2.Get(9)<<2 |
		cp.Wire2.Get(10)<<1 |
		cp.Wire2.Get(11)
	A := 0 // xyzzy
	B := 0 // xyzzy
	C := 0
	switch operation {
	case 0: // Clear output
	case 1: // A + B
		C = A + B
	}
	_ = C
}

/// ==============================================================================================================================================================
/// ==============================================================================================================================================================
// --------------------------------------------------------------------------
// A single wire
// --------------------------------------------------------------------------
/// ==============================================================================================================================================================
/// ==============================================================================================================================================================
type Wire interface {
	Get(pinNo int) int
	Set(pinNo, val int)
	ConnectFromTo(fChip string, fPin int, tChip string, tPin int)
	Tick()
}

type WireImpl struct {
	Name       string
	ChipName   string
	PinNo      int
	cur_input  int
	cur_output int
	n_set      int
	// c             chan int
	// connectTo     []int // chips connected to
	// connectToPins []int // pin no on chips
}

func NewWireImpl(wirename, cn string, pn int) Wire {
	return &WireImpl{
		Name:       wirename,
		ChipName:   cn,
		PinNo:      pn,
		cur_input:  0,
		cur_output: 0,
		// c:             make(chan int),
		// connectTo:     make([]int, 0, 14),
		// connectToPins: make([]int, 0, 14),
	}
}

func (ww *WireImpl) Get(pinNo int) int {
	return ww.cur_output
}
func (ww *WireImpl) Set(pinNo, val int) {
	if ww.n_set > 0 {
		// xyzzy - error
		fmt.Fprintf(os.Stderr, "Multiple set drivers on [%s,%s,%v] this is a control error\n", ww.Name, ww.ChipName, ww.PinNo)
	}
	ww.cur_input = val
	ww.n_set++
}
func (ww *WireImpl) Tick() {
	ww.n_set = 0
	ww.cur_output = ww.cur_input
}
func (ww *WireImpl) ConnectFromTo(fChip string, fPin int, tChip string, tPin int) {
}

// --------------------------------------------------------------------------
// WireAll
// --------------------------------------------------------------------------
//   NameOfWire			chip.Pin 		or  chip.AliasName
// --------------       --------------------------------------------------------------
//Wire MyWireName 		pos1.12 pos2.4 pos3.8

type WireAll struct {
	Connections map[string][]*Wire
}

// Chip mem32x256 			mem1		// Microcode Store - 8k (if need more than one then add a 2nd one)
type ChipAll struct {
	// map from Name to Type of chip - "Chip" is an interface to the "Kind" of chip.
	Chips map[string]*Chip
}

// --------------------------------------------------------------------------
func main() {
	c1 := NewLs7400("c.1") // Create a new chip
	_ = c1
	// Attach pins to wires.
	// start chip.
	// OPTIONAL: load chip with data (Memory chip) (microcode store)

	// Run simpulation (cli)
	// or
	// Run Web interface simualation (Logic Analyzer)

}

// each wire is a chanel? with 0,1 on it
