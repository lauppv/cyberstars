#include <stdio.h>

int main(void) {
    int seconds = 5;
    int error_detected = 1;
    switch (seconds) {
    case 100: printf("Checking memory\n"); break;
    case 60: printf("Checking peripherals\n"); break;
    case 30: printf("Loading operating system kernel\n"); break;
    case 10: printf("Starting system processes\n"); break;
    default:
        switch (seconds < 10) {
        case 1:
            puts(error_detected == 1 ? "Error detected. Aborting launch"
                                     : "No error detected. Starting the system...");
            break;
        default:
            printf("%d seconds have no effect\n", seconds);
        }
    }
    return 0;
}
