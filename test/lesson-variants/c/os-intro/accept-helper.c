#include <stdio.h>
#include <unistd.h>

static void log_shift(int code) {
    printf("PID: %d\n", (int)getpid());
    printf("Exiting with code %d\n", code);
}

int main(void) {
    int code = 0;
    log_shift(code);
    return code;
}
