# Error Correction Codes                                                     

First add to this error detection codes.  Luhn check.   Luhn is not the best check.
If you are going to use one use Verhoeff - we will talk about that in a moment.
First Luhn.

Every time a CC is verified this is the first step.

Credit cards use from 13 to 16 digits.  You can identify the
system used with

| Leading Digits |  Card type                   |
|:--------------:|:-----------------------------|
|	4            | Visa cards                   |
|	5            | Master cards                 |
|	37           | American Express cards       |
|	6            | Discover cards               |


The first step in validate a card is to use the Luhn algorithm. This is also
called the Mod 10 algorithm. It was developed by Hans Luhn at IBM. This is a
check-digit that is included at the end of the CC number. It is used to validate
a variety of other identification numbers including,  IMEI numbers,
Greek Social Security Numbers (ΑΜΚΑ),
South African ID Numbers,
Canadian Social Insurance Numbers,
Israel ID Numbers,
survey codes appearing on McDonald's, Taco Bell, and Tractor Supply Co. receipts.  
U.S. Patent No.
2,950,048 (now expired) has the details of how it works.



xyzzy - below

		Luhn check or the Mod 10 check, which can be described as follows (for illustration,
		consider the card number 4388576018402626):



		Step 1. Double every second digit from right to left. If doubling of a digit results in a
		two-digit number, add up the two digits to get a single-digit number (like for 12:1+2, 18=1+8).

		Step 2. Now add all single-digit numbers from Step 1.
		4 + 4 + 8 + 2 + 3 + 1 + 7 + 8 = 37

		Step 3. Add all digits in the odd places from right to left in the card number.
		6 + 6 + 0 + 8 + 0 + 7 + 8 + 3 = 38

		Step 4. Sum the results from Step 2 and Step 3.
		37 + 38 = 75

		Step 5. If the result from Step 4 is divisible by 10, the card number is valid; otherwise, it is invalid.
		Examples :

		Input : 379354508162306
		Output : 379354508162306 is Valid

		Input : 4388576018402626
		Output : 4388576018402626 is invalid



See: [https://www.geeksforgeeks.org/program-credit-card-number-validation/](https://www.geeksforgeeks.org/program-credit-card-number-validation/)
[https://en.wikipedia.org/wiki/Luhn_algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)

