#include <stdio.h>

int main(void) {
int seconds = 60;
int errorDetected = 0;

    if (seconds == 100) {
        printf("Starting all onboard computers\n");
    } else if (seconds == 60) {
        printf("Checking connection with the control tower\n");
    } else if (seconds == 20) {
        printf("Starting secondary engines\n");
    } else if (seconds == 10) {
        printf("Starting the main engines\n");
    } else if (seconds < 10) {
        if (errorDetected) {
            printf("Error detected. Canceling the mission\n");
        } else {
            printf("No error detected. Taking off...\n");
        }
    } else {
        printf("%d seconds has no effect\n", seconds);
    }

    return 0;

}
