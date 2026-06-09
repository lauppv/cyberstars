#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { TODO, IN_PROGRESS, DONE } Status;

typedef struct {
    char title[100];
    Status status;
} Task;

int main(void) {
    return 0;
}
