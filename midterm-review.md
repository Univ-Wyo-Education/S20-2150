
1. For simple regular expressions - be able to produce the state diagram that matches with the regular expression and identify
what strings will be matched and if a string will be rejected by the regular expression.  Know that regular expressions are equivalent to
some deterministic or non-deterministic automata.  Know that you can't use a regular expression to find matching (balanced) parenthesis.

Examples:

```
^a$					Matches the letter a on a line by itslf
^ab*$				Matches the letter a followed by any number of b's on a line
^abc				Matches a line that starts with abc 
abc$				Matches a line that ends with abc
[0-7]				Matches an octal digit 0, 1, 2, 3, 4, 5, 6, 7
[a-f]				Matches a lower case a, b, c, d, e, f
[0-9a-fa-F]			Matches a hex digits both upper and lower case
[0-9][0-9]*			Matches 1 or more decimal digits
[-+][0-9][0-9]*		Matches a plus or minus followed by a decimal number atleast 1 long
```

Be able to draw out a Non-Deterministic Finite State Automata (NDFA) for these regular expressions.
Use "BOL" for beginning of line, `^` and EOL for end of line `$`.



