#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("Child: hello from PID %d\n", getpid());
    printf("Parent: child has finished\n");
    return 0;
}
