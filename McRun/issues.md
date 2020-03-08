
1. Per instruction tests of processing
	Load a program into memory, then run a test on it.
	7000: Halt
	2000: Load / Halt
	5001: Load / Add / Halt
	5002 Load / Subt / Halt
	5003: Clear / Subt / Halt
	5004: Clear / Jump / Halt / Halt
	5005: Load / Store / Halt 
	5007: Input +
	5006: Output +
	5010: *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number > 0
	5011: *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number < 0
	5012: *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number == 0 (should behave like 5010)
	5020: *OpSkipGt0    = OpCodeType(0x8800) // 00 -- Number > 0
	5021: *OpSkipGt0    = OpCodeType(0x8000) // 00 -- Number < 0
	5022: *OpSkipGt0    = OpCodeType(0x8000) // 00 -- Number == 0 (should behave like 5020)
	5030: *OpSkipEq0    = OpCodeType(0x8800) // 00 -- Number > 0
	5031: *OpSkipEq0    = OpCodeType(0x8000) // 00 -- Number < 0
	5032: *OpSkipEq0    = OpCodeType(0x8000) // 00 -- Number == 0 
    5040: *OpLoadI      = OpCodeType(0xd000)
    5041: *OpStoreI     = OpCodeType(0xe000)
    5043: *OpAddI       = OpCodeType(0xB000)
    5042: *OpJumpI      = OpCodeType(0xc000)
    5044: JnS (worked) -- calls into question JumpI(return)

data/ec25fd81d2c8ef25b6e3335e06311723cf202c34db454ffc3c9f593e268b3586.txt
data/6323cdc278b6a2c967716d173d1c278538f378496f5e3b745da1a08bfafd55af.txt  CPU Code (hw2.hex)




Issues:

xyzzy - cleanup output / debug stuff

1. xyzzy7000_001: IN test 7000 - at end the display of values from the IR (15..12) is not shown above the green line.
1. xyzzy7000_002: An output line inthe "output" box - should show how MUX combined the results also.
1. xyzzy7000_003: Need a way to "peek" into microcode and see all lines on at address.
1. xyzzy7000_004: Cleanup of "output" so add new lines - no clear - a "screen scrole" behavior (with a button to see last 300 lines as a modal?)
1. xyzzy7000_006: Start process of "debug" flags - that can be set in Config
1. xyzzy7000_007: Add a "run-test" button that connects to all the tests - and allows re-run from UI.

1. xyzzy2000_002: whenver memory_Read - should take the action of MAR -> Memory on, Memory to MDR on - and show lines.
1. xyzzy2000_003: Display of "Main Memory" could use PC.x._data_ for it's address for instruction dis-assembley.
1. /* Kludge xyzzy2000_004 */

1. xyzzy5005_001: both read/write lines to memory are turned on during a store.
1. xyzzy5005_002: green line is left turned on.

xyzzy8000 -- next test Load / Add / Halt

8 Down and 7 to go.  Load, Add, Subt, Halt, SkipLt0, Input, Output, Jump, Clear
	ToDo	: AddI, SubtI, LoadI, StoreI, JnS, (SkipGt0, SkipEq0)


1. xyzzy5010_001: - On "memory_Read" - falied to light (and add arrow to) the line form Memory to MDR. End of Fetch Cycle Read.
1. xyzzy5010_004: - Line from RESULT "Is Zero" to MUX is not created/turned on when ALU operation indicates compare.


1. xyzzy5041_001: - at one point we have both "read" and "write" lines on to memory at once - single step it an late in the StoreI process --- OOPS!

1. xyzzy5044_001: - Seems like JumpI is wrong.





-- fixed --
	1. xyzzy2000_001: really should fix this to be a .turn-off-at-startup class that is across all of `var lineOn = [` at init.
