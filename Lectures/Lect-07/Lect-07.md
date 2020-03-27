# Gates and Boolean Logic                                                    

We have been hitting on this for some time.  Let's get serious about some gates
and logic.

Last time we talked about a one-hot encoding.  We will be using (later in the year)
a one-hot encoding in the MARIE instruction set.

Instruction 0x8000 is the Jump-Compare and Misc instruction.  The 2 bits after the 8
determine how the compare is done.

0x8000		= 0b_1000_0000_0000_0000

0x8400		= 0b_1000_0100_0000_0000

0x8800		= 0b_1000_1000_0000_0000

Let's one-hot encode this 2 bit region.

| Bits In | d0 | d1 | d2 | Oth |
|--------:|:--:|:--:|:--:|:---:|
|     00  |  1 |  0 |  0 | 0   |
|     01  |  0 |  1 |  0 | 0   |
|     10  |  0 |  0 |  1 | 0   |
|     11  |  0 |  0 |  0 | 1   |

This matches with a 74ls155 dual 2 to 4 bit decoder.

Show Data Sheet.

System Overview.

Using Memory to implement a "logic" circuit.




