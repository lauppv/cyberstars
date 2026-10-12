#include <stdio.h>

void print_permissions(const char *name, int permissions) {
    static const char *labels[3] = {"READ", "WRITE", "EXECUTE"};
    printf("%s:", name);
    for (int bit = 0; bit < 3; bit++) {
        if (permissions & (1 << bit)) printf(" %s", labels[bit]);
    }
    putchar('\n');
}

int main(void) {
    char who[64];
    int mask;
    FILE *out = fopen("config.txt", "w");
    if (!out) return 1;
    while (scanf("%63s %d", who, &mask) == 2) fprintf(out, "%s %d\n", who, mask);
    fclose(out);

    FILE *in = fopen("config.txt", "r");
    if (!in) return 1;
    while (fscanf(in, "%63s %d", who, &mask) == 2) print_permissions(who, mask);
    fclose(in);
    return 0;
}
