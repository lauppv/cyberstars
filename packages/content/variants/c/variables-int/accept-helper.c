#include <stdio.h>

static void show(const char *label, int v) {
    printf("%s: %i\n", label, v);
}

int main(void) {
    int age = 45, access_level = 3;
    show("Age", age);
    show("Access", access_level);
    return 0;
}
