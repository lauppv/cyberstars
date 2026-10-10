#include <stdio.h>

static void log_reading(const char *label, double value) {
    printf("%s: %.2f\n", label, value);
}

int main(void) {
    double temperature = 21.6, humidity = 45.5;
    log_reading("Temperature", temperature);
    log_reading("Humidity", humidity);
    return 0;
}
