#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t me = getpid();
    printf("PID: %ld\n", (long)me);
    puts("Exiting with code 0");
    return 0;
}
