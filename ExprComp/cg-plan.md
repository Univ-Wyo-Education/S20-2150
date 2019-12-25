
A = 3			This is: A = [Lit]
------
	Load _3
	Store A

A = B			This is: A = [Lit]
------
	Load B  
	Store A

0 + 1			ID + ID				ID + 0		0 + ID
----------------------------------------------------------
	Load _0
	Add _1
	-> Reg

0 + [Tree-Reg]
---------------
	Add _0
	-> Reg

[Tree-Reg] + 0
---------------
	Add _0
	-> Reg

[Tree-Reg] + [Tree-Reg]
---------------
	Assign _tmp[x]
	Store Left -> _tmp[x]
	Run (generate right)
	Add _tmp[x] (from Right)
	-> Reg

# - (Subtract)		-- All forms of A - B

# - (Unary)			-- All forms of - A

# * (Multiply)		-- All forms of A * B

# ++ Increment		-- All forms of A ++

# -- Decrement		-- All forms of A --

# Store Expression -> Variable

A = Expr		
-----
	Store A


Put A	
-----
	Output A

In A	
-----
	Input A
