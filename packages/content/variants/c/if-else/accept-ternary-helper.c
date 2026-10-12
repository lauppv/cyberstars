#include <stdio.h>

static int freezing(int deg) { return deg < 0; }

int main(void) {
    int temperature = 12;
    const char *msg;
    if (freezing(temperature)) msg = "cold alert";
    else msg = "temperature normal";
    printf("%s\n", msg);
    return 0;
}
