package main

type ChipInterfce interface {
	Ld()
	Inc()
	Out()
	BusConnect()
	Tick()
}
