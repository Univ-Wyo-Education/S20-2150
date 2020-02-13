package main

// Microcode Emulator

type ChipInterface interface {
	Setup(PinName string, size int, ConnectTo string)
	Tick()
}

func main() {
}

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

type WireValue uint

const (
	Is_1 WireValue = 1
	Is_0 WireValue = 0
	Is_X WireValue = 2 // Unset
)

type AWire struct {
	Val    uint     // 0 1
	WhoSet []string // Name of Setter
}

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

type ABus struct {
	Val     uint // Value of size
	ValMask uint // 0x3 for 2, 0x7 for 3, 0xf for 4 etc.
	BusSize int  // 2, 4, 8, 16 etc
	IsSet   bool
	WhoSet  []string // Name of Setter
}

// -----------------------------------------------------------------------------------------------
// PC
// -----------------------------------------------------------------------------------------------

type PCRegister struct {
	Data uint // 16 bits

	Ld     AWire // 0, 1, x + Who Set
	Inc    AWire // 0, 1, x + Who Set
	Out    AWire // 0, 1, x + Who Set
	Clr    AWire // 0, 1, x + Who Set
	Input  ABus  // 16 bit bus
	Output ABus  // 16 bit bus

	// Global data to pull from
	// List of Wires from this chip to the world
	// Writes - from/to etc.
}

func NewPC() ChipInterface {
	return &PCRegister{
		Data: 0,
	}
}

func (cc *PCRegister) Setup(PinName string, size int, ConnectTo string) {
}
func (cc *PCRegister) Tick() {
	// Pull Inputs into PCRegister
	// Act on Inputs
	// Set Outputs
	// Report Errors
}
