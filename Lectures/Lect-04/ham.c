#include <stdio.h>

// hammingDistance will calculate hamming distance between n1 and n2
int hammingDistance(unsigned int n1, unsigned int n2) { 
	unsigned int x = n1 ^ n2; 
	int setBits = 0; 
	while (x > 0) { 
		setBits += x & 1; 
		x >>= 1; 
	} 
	return setBits; 
} 

int main() { 
	printf ( "Hamming Distance: %d\n", hammingDistance(19, 23));
	return 0; 
} 
