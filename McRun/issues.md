
Issues:

2. Split McRun/mm....html test code into setup/run/check 
	4. Convert existing test cases into { setup | run | verify } and figure out a way to do these with the new User Interface.
		- on "Halt" run the validation of the test - if test is turned on
		-- ToDo --
				<option value="test2000">  2000:  Load / Halt                                                </option>
				<option value="test5001">  5001:  Load / Add / Halt                                          </option>

				<option value="test5002">  5002:  Load / Subt / Halt                                         </option>
				<option value="test5003">  5003:  Clear / Subt / Halt                                        </option>
				<option value="test5004">  5004:  Clear / Jump / Halt / Halt                                 </option>
				<option value="test5005">  5005:  Load / Store / Halt                                        </option>
				<option value="test5007">  5007:  Input   - 0x5000                                           </option>
				<option value="test5006">  5006:  Output  - 0x6000                                           </option>
				<option value="test5010">  5010:  SkipLt0 - 0x8000 / ac &gt; 0                               </option>
				<option value="test5011">  5011:  SkipLt0 - 0x8000  / ac &lt; 0                              </option>
				<option value="test5012">  5012:  SkipLt0 - 0x8000  / ac == 0 (should behave like test 5010) </option>
				<option value="test5020">  5020:  SkipGt0 - 0x8800  / ac &gt; 0                              </option>
				<option value="test5021">  5021:  SkipGt0 - 0x8800  / ac &lt; 0                              </option>
				<option value="test5022">  5022:  SkipGt0 - 0x8800  / ac == 0 (should behave like test 5020) </option>
				<option value="test5030">  5030:  SkipEq0 - 0x8400  / ac &gt; 0                              </option>
				<option value="test5031">  5031:  SkipEq0 - 0x8400  / ac &lt; 0                              </option>
				<option value="test5032">  5032:  SkipEq0 - 0x8400  / ac == 0                                </option>
				<option value="test5040">  5040:  LoadI   - 0xd000                                           </option>
				<option value="test5041">  5041:  StoreI  - 0xe000                                           </option>
				<option value="test5043">  5043:  AddI    - 0xB000                                           </option>
				<option value="test5042">  5042:  JumpI   - 0xc000                                           </option>
				<option value="test5044">  5044:  JnS     - 0x0000                                           </option>
				<option value="test1000">  1000:  PC                                                         </option>
				<option value="test1001">  1001:  PC -&gt; MAR                                               </option>
				<option value="test1102">  1102:  Output -&gt; 7-seg                                         </option>
				<option value="test1101">  1101:  AC -&gt; Output                                            </option>
				<option value="test1003">  1003:  MDR -&gt; Bus -&gt; MAR                                    </option>
				<option value="test1104">  1104:  Result -&gt; AC                                            </option>
				<option value="test1105">  1105:  Input -&gt; AC                                             </option>
				<option value="test1002">  1002:  PC -&gt; MAR -&gt; Memory Read -&gt; IR                    </option>
				<option value="test3000">  3000:  Test MUX                                                   </option>
		x. Add "help" to tests - paint into text area the "code" that is to be run - and what to click next [ tick ] if checked.
			see test3001 - near top.
				showTextInOutputBox("test3001 - test of ALU");


0. Defect: Run test 7000 twice / should be able to do a "reset" in between - but instead it fails on 2nd run.
	Fresh page reload will allow it to run.  Reset not fully -resetting- the system.
	// How ?? Why xyzzy0xb8
	look in js/test_7000.js


9. Setup a "real" server with this on it -  (4hrs) (set some domain t5432z.com to point to it?)
	- aws free tear ec2?
	- $5 a month ?
	aws/ec2.micro - ubuntu - 1cp free 750hrs a month.
	1. A "push" to server.






-----------------------------------------------------------------------------------------------------------------------------------------------
Test Plan
-----------------------------------------------------------------------------------------------------------------------------------------------
1. Click on each of the buttons and verify functionality.
2. Run a program or 2 









-----------------------------------------------------------------------------------------------------------------------------------------------
VIDEO:
-----------------------------------------------------------------------------------------------------------------------------------------------
6. Video of running a test - 1st video of using MC machine
7. Video of Microcode - and how it works


-----------------------------------------------------------------------------------------------------------------------------------------------
TODO Later
-----------------------------------------------------------------------------------------------------------------------------------------------

5. Save the selected logic-probe lines in local storage - reload on restart.
1. Implement scroll on output panel - test3001 multiple times.
3. Reveiw mm... for what to do next
10. One Note...















































































1. Per instruction tests of processing
	Basic Tests
	1000. PC
	1001. PC -> MAR
	1102. Output -> 7-seg
	1101. AC -> Output
	1003. MDR -> Bus -> MAR 
	1104. Result -> AC
	1105. Input -> AC
	1002. PC -> MAR -> Memory Read -> IR
	3000. Test MUX
	3001. Test ALU
	7000. Halt
	2000. Test Load, Halt

	Load a program into memory, then run a test on it.
	7000. Halt
	2000. Load / Halt
	5001. Load / Add / Halt
	5002. Load / Subt / Halt
	5003. Clear / Subt / Halt
	5004. Clear / Jump / Halt / Halt
	5005. Load / Store / Halt 
	5007. Input +
	5006. Output +
	5010. *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number > 0
	5011. *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number < 0
	5012. *OpSkipLt0    = OpCodeType(0x8000) // 00 -- Number == 0 (should behave like 5010)
	5020. *OpSkipGt0    = OpCodeType(0x8800) // 00 -- Number > 0
	5021. *OpSkipGt0    = OpCodeType(0x8000) // 00 -- Number < 0
	5022. *OpSkipGt0    = OpCodeType(0x8000) // 00 -- Number == 0 (should behave like 5020)
	5030. *OpSkipEq0    = OpCodeType(0x8800) // 00 -- Number > 0
	5031. *OpSkipEq0    = OpCodeType(0x8000) // 00 -- Number < 0
	5032. *OpSkipEq0    = OpCodeType(0x8000) // 00 -- Number == 0 
    5040. *OpLoadI      = OpCodeType(0xd000)
    5041. *OpStoreI     = OpCodeType(0xe000)
    5043. *OpAddI       = OpCodeType(0xB000)
    5042. *OpJumpI      = OpCodeType(0xc000)
    5044. JnS (worked)  = OpCodeType(0x0000)

v1.4.5 Sat Mar 14 16:00:54 MDT 2020
data/c6dfd64496869541848a710e643a78cc7d821ba464feb0284b3e72d88c916f03.txt Microcode.
data/6323cdc278b6a2c967716d173d1c278538f378496f5e3b745da1a08bfafd55af.txt CPU Code (hw2.hex)

-- low prioroity / later --
	1. xyzzy7000_006: + Start process of "debug" flags - that can be set in Config
	1. Comments on all the functions.   Move testing out to ./js/mm_test_code.js
	1. /* Kludge xyzzy2000_004 */
	1. xyzzy7000_003: Need a way to "peek" into microcode and see all lines on at address.

-- ignored --
	1. xyzzy2000_003: Display of "Main Memory" could use PC.x._data_ for it's address for instruction dis-assembley.
-- fixed --
	1. xyzzy2000_001: really should fix this to be a .turn-off-at-startup class that is across all of `var lineOn = [` at init.
	1. xyzzy7000_001: IN test 7000 - at end the display of values from the IR (15..12) is not shown above the green line.
	1. xyzzy7000_002: An output line in the "output" box - should show how MUX combined the results also.
	1. xyzzy5032_000: Add in the skip-set to single step mode to all the tests.
	1. xyzzy4000_001: Line from is-zero is non-existent
		<g id="id_is_zero_to_mux" class="x-off-at-start">
	1. xyzzy5001_000: Line from Main Memory to MDR is not highlighted when Read/Write happen.
	1. xyzzy - cleanup output / debug stuff
	1. xyzzy5005_002: green line is left turned on.
	1. xyzzy5010_004: - Line from RESULT "Is Zero" to MUX is not created/turned on when ALU operation indicates compare.
	1. xyzzy5010_001: - On "memory_Read" - falied to light (and add arrow to) the line form Memory to MDR. End of Fetch Cycle Read.
	1. xyzzy5044_001: - Seems like JumpI is wrong.
	1. Setup - form
		- xyzzy7000_007: + Add a "run-test" (under setup) button that connects to all the tests - and allows re-run from UI.
		- Setup screen
			- Take the tests and put a check-mark and a button for each one. (Check mark turns on single step)
			- Delay for "run" in run loop.
	1. Run - 
			- The "run" loop - with background runner and delay ( 100ms for each tick? )  Settable in Config.
(confirmed)
1. xyzzy5005_001: both read/write lines to memory are turned on during a store.
	- xyzzy5041_001: - at one point we have both "read" and "write" lines on to memory at once - single step it an late in the StoreI process --- OOPS!
1. xyzzy2000_002: whenever memory_Read - should take the action of MAR -> Memory on, Memory to MDR on - and show lines.
1. Clean up the "output" box - so will not duplicate messages to it.
1. do the rest of the buttons.
	- Input - put in a list of values - that gets used each time an "Input" instruction happens.
		+++ Show Memory - Set MAR - and call display of memory at that location. (show range of memory? - show ptr at location(pc))  See: LoadMA()
1. xyzzy7000_004: +++ Cleanup of "output" so add new lines - no clear - a "screen scrole" behavior (with a button to see last 300 lines as a modal?)
-- done -- Logic Probe --
	+++ * Go from McJmp_0 -> McJmp_{bus:size 8}
	+++1. Show a list of liens from
			// var ListOfWires = []; as titles (with sizes if a "bus"
		Checkbox on each one.
		If checked then add it to the list...
	+++2. 	If a "bus" then display a number instead of a green-line

	function getWidthOfLine ( name )
		return 1; // xyzzy-draw
	// Data collection seems to work
		// var lpData = {}; // xyzzyLP - Collect data for Logic Probe
	* A modal with all the "lines" that you can put the probe on.
	* Chebox for liens - allow 10 at a time
	* Every time the value chagnes at the end of a cycle for a line - put it in the array["line"][DeltaT]
		Pull this data from end-of-cycle - theWorld2
	* Keep 12 cycles of [DeltaT]
	* Chop and Rotate the data - so data is most recent 12.  Grow to 12, then pick off and rotate.
	3. on showLogicProbe() - list connected wires and other info (description) for each wire.
		function showLogicProbe ( doShow ) {		:2022
		show postion from microcode if a microcode output.
	// should reverse order of display in array before drawing lines if left is cuurrent time.
	* At end of each cycle - if logicProbeOn - then display all the liens in a box at the bottom.
	1. Re-org into a table the list of wires - smaller footprint on checkboxes
0. test3001 - test of ALU - is failing when run at the end of testAll and succeeding if run on its own.
	test 11 - only failing test.
	1. Check that display of "Bus" displays a 0x4000

1.  Logic Probe 
	Notes:
		function AddConnectionsToListOfWires() {						// Create lis of all wires for display on Logic Probe Modal
		function showLogicProbe ( doShow ) {							// Display Logic Probe Modal, turn on Logic Probe Panel			2019 def
			showLogicProbe ( true );									// Display the Modal											2261 call from infoOn1('logic-probe') (button click)
		function SubmitButton_for_LogicProbeModal() {					// Submit For: Display the Logic Probe Modal
		function drawLpLine() {											// Display lines/values from lpData
	++1. When pick a line, display a count at the bottom of # picked, # left, catch each "pick"
	++2. Connected wires - and list them - verify this.

