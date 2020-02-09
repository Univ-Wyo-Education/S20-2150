package main

type ResultChip struct {
	Data     int
	bussConn []int
	isZero   bool // Connects as output to Decoder
}

func NewResultChip() ChipInterfce {
	return &ResultChip{}
}

// Load from Buss
func (pc *ResultChip) Ld() {
}

// Increment counter
func (pc *ResultChip) Inc() {
	// Generates Error - No Such Connection
}

// Drive outputs to buss
func (pc *ResultChip) Out() {
}

// Configure this.
func (pc *ResultChip) BusConnect() {
}

// Clock Tick Receiver
func (pc *ResultChip) Tick() {
}
