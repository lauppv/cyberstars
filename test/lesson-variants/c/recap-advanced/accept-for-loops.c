#include <stdio.h>

enum { R = 1, W = 2, X = 4 };

void print_permissions(const char *name, int permissions) {
    char line[128];
    int len = sprintf(line, "%s:", name);
    if (permissions & R) len += sprintf(line + len, " READ");
    if (permissions & W) len += sprintf(line + len, " WRITE");
    if (permissions & X) len += sprintf(line + len, " EXECUTE");
    puts(line);
}

int main(void) {
    char name[50];
    int p;
    FILE *f = fopen("config.txt", "w");
    for (;;) {
        if (scanf("%s %d", name, &p) != 2) break;
        fprintf(f, "%s %d\n", name, p);
    }
    fclose(f);
    f = fopen("config.txt", "r");
    for (;;) {
        if (fscanf(f, "%s %d", name, &p) != 2) break;
        print_permissions(name, p);
    }
    fclose(f);
    return 0;
}
