
#include <stdio.h>

#define OP_LOAD     0x1
#define OP_ADD      0x3
#define OP_HALT     0x7

void runVM(unsigned int* mem) {
    unsigned int PC = 0;
    unsigned int IR = 0;
    unsigned int AC = 0;
	unsigned int op, hand; 

    while (1) {		// Loop Forever
		IR = mem[PC++];
		op = ( IR & 0xF000 ) >> 12;
		hand = IR & 0x0FFF;
        switch (IR) {
            case OP_LOAD:
				AC = mem[hand];
			break;
            case OP_ADD:
                AC = AC + mem[hand];
			break;
            case OP_HALT:
                return;
            default:
                printf ( "oops - an error 0x%04x not valid\n", IR << 12);
        }
    }
}

void runVM_ComputedGoTo(unsigned int* mem) {
    /* The indices of labels in the dispatch_table are the relevant opcodes */
    static void* dispatch_table[] = {
		&&do_other,		/* 0 */
		&&do_load,		/* 1 */
		&&do_other,		/* 2 */
		&&do_add,		/* 3 */
		&&do_other,		/* 4 */
		&&do_other,		/* 5 */
		&&do_other,		/* 6 */
		&&do_halt,		/* 7 */
		&&do_other,		/* 8 */
		&&do_other,		/* 9 */
		&&do_other,		/* A */
		&&do_other,		/* B */
		&&do_other,		/* C */
		&&do_other,		/* D */
		&&do_other,		/* E */
		&&do_other,		/* F */
	};
    unsigned int PC = 0;
    unsigned int IR = 0;
    unsigned int AC = 0;
	unsigned int op, hand; 


top:
	IR = mem[PC++]; 
	op = ( IR & 0xF000 ) >> 12; 
	hand = IR & 0x0FFF; 
	goto *dispatch_table[op];

	do_halt:
		return;
	do_add:
		AC = AC + mem[hand];
		goto top;
	do_load:
		AC = mem[hand];
		goto top;
	do_other:
		printf ( "oops - an error 0x%04x not valid\n", IR << 12);
		goto top;
}

int main() {
	// Placeholder for the moment
}
