#include <stdio.h>

void print_permissions(const char *name, int permissions) {
    char line[128];
    int len = sprintf(line, "%s:", name);
    if (permissions % 2) len += sprintf(line + len, " READ");
    if (permissions / 2 % 2) len += sprintf(line + len, " WRITE");
    if (permissions / 4 % 2) len += sprintf(line + len, " EXECUTE");
    puts(line);
}

int main(void) {
    char name[50];
    int p;
    FILE *f = fopen("config.txt", "w");
    while (scanf("%s %d", name, &p) == 2) fprintf(f, "%s %d\n", name, p);
    fclose(f);
    f = fopen("config.txt", "r");
    while (fscanf(f, "%s %d", name, &p) == 2) print_permissions(name, p);
    fclose(f);
    return 0;
}
