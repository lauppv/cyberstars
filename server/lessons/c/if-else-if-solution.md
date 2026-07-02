```c
#include <stdio.h>

int main(void) {
    int seconds, error_detected;
    scanf("%d %d", &seconds, &error_detected);

    if (seconds == 100) {
        printf("Checking memory\n");
    } else if (seconds == 60) {
        printf("Checking peripherals\n");
    } else if (seconds == 30) {
        printf("Loading operating system kernel\n");
    } else if (seconds == 10) {
        printf("Starting system processes\n");
    } else if (seconds < 10) {
        if (error_detected == 1) {
            printf("Error detected. Aborting launch\n");
        } else {
            printf("No error detected. Starting the system...\n");
        }
    } else {
        printf("%d seconds have no effect\n", seconds);
    }
    return 0;
}
```
