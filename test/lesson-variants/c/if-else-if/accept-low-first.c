#include <stdio.h>

int main(void) {
    int seconds = 5;
    int error_detected = 1;

    if (seconds < 10)
        puts(error_detected == 1 ? "Error detected. Aborting launch"
                                 : "No error detected. Starting the system...");
    else if (seconds == 10)
        puts("Starting system processes");
    else if (seconds == 30)
        puts("Loading operating system kernel");
    else if (seconds == 60)
        puts("Checking peripherals");
    else if (seconds == 100)
        puts("Checking memory");
    else
        printf("%d seconds have no effect\n", seconds);
    return 0;
}
