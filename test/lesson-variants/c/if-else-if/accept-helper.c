#include <stdio.h>

static const char *stage(int t) {
    if (t == 100) return "Checking memory";
    else if (t == 60) return "Checking peripherals";
    else if (t == 30) return "Loading operating system kernel";
    else if (t == 10) return "Starting system processes";
    return NULL;
}

int main(void) {
    int error_detected = 0, seconds = 60;
    const char *msg = stage(seconds);
    if (msg) {
        printf("%s\n", msg);
    } else if (seconds < 10) {
        if (error_detected) printf("Error detected. Aborting launch\n");
        else printf("No error detected. Starting the system...\n");
    } else {
        printf("%d seconds have no effect\n", seconds);
    }
    return 0;
}
