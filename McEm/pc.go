package main

type PcChip struct {
	Data     int
	bussConn []int
}

func NewPcChip() ChipInterfce {
	return &PcChip{}
}

// Load from Buss
func (pc *PcChip) Ld() {
}

// Increment counter
func (pc *PcChip) Inc() {
}

// Drive outputs to buss
func (pc *PcChip) Out() {
}

// Configure this.
func (pc *PcChip) BusConnect() {
}

// Clock Tick Receiver
func (pc *PcChip) Tick() {
}
