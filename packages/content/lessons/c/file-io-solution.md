```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("shift.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "Enescu 95\n");
    fprintf(f, "Vlad 82\n");
    fprintf(f, "Dobre 98\n");
    fclose(f);

    f = fopen("shift.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char name[50];
    int incidents;
    while (fscanf(f, "%s %d", name, &incidents) == 2) {
        printf("Technician: %s, Incidents: %d\n", name, incidents);
    }
    fclose(f);

    return 0;
}
```
