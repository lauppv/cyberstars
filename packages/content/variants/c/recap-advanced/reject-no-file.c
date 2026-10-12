#include <stdio.h>

void print_permissions(const char *name, int permissions) {
    printf("%s:", name);
    if (permissions & 1) printf(" READ");
    if (permissions & 2) printf(" WRITE");
    if (permissions & 4) printf(" EXECUTE");
    printf("\n");
}

int main(void) {
    char name[50];
    int permissions;
    while (scanf("%s %d", name, &permissions) == 2) print_permissions(name, permissions);
    return 0;
}
