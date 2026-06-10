#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { DE_FACUT, IN_LUCRU, GATA } Status;

typedef struct {
    char titlu[100];
    Status status;
} Sarcina;

int main(void) {
    return 0;
}
