```c
#include <stdio.h>

#define PERM_READ    (1 << 0)
#define PERM_WRITE   (1 << 1)
#define PERM_EXECUTE (1 << 2)

void print_permissions(const char *name, int permissions) {
    printf("%s:", name);
    if (permissions & PERM_READ) {
        printf(" READ");
    }
    if (permissions & PERM_WRITE) {
        printf(" WRITE");
    }
    if (permissions & PERM_EXECUTE) {
        printf(" EXECUTE");
    }
    printf("\n");
}

int main(void) {
    char name[50];
    int permissions;

    FILE *f = fopen("config.txt", "w");
    if (f == NULL) {
        return 1;
    }
    while (scanf("%s %d", name, &permissions) == 2) {
        fprintf(f, "%s %d\n", name, permissions);
    }
    fclose(f);

    f = fopen("config.txt", "r");
    if (f == NULL) {
        return 1;
    }
    while (fscanf(f, "%s %d", name, &permissions) == 2) {
        print_permissions(name, permissions);
    }
    fclose(f);

    return 0;
}
```
