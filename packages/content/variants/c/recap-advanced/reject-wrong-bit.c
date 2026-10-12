#include <stdio.h>

void print_permissions(const char *name, int permissions) {
    printf("%s:", name);
    if (permissions & 1) printf(" READ");
    if (permissions & 2) printf(" WRITE");
    if (permissions & 3) printf(" EXECUTE");
    printf("\n");
}

int main(void) {
    char name[50];
    int permissions;
    FILE *f = fopen("config.txt", "w");
    while (scanf("%s %d", name, &permissions) == 2) fprintf(f, "%s %d\n", name, permissions);
    fclose(f);
    f = fopen("config.txt", "r");
    while (fscanf(f, "%s %d", name, &permissions) == 2) print_permissions(name, permissions);
    fclose(f);
    return 0;
}
