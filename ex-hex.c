#include <stdio.h>
#include <stdlib.h>

int main () {
	char str[30] = "a003 This is test";
	char *ptr;
	long ret;
	int final_ret;

	ret = strtol(str, &ptr, 16);		// Hex - base conversion


	// base 10 printout
	printf("The number(unsigned long integer) is %ld\n", ret);
	printf("String part is |%s| - what is after the number", ptr);

	final_ret = (int)ret;			// Convert from long to int.
	// base 10 and base 16
	printf("The final int(integer) is %d, 0x%04x\n", final_ret, final_ret);

	return(0);
}
