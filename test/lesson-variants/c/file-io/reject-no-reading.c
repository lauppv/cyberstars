#include <stdio.h>

int main(void) {
    FILE *f = fopen("shift.txt", "w");
    fprintf(f, "Enescu 95\nVlad 82\nDobre 98\n");
    fclose(f);
    printf("Technician: Enescu, Incidents: 95\n");
    printf("Technician: Vlad, Incidents: 82\n");
    printf("Technician: Dobre, Incidents: 98\n");
    return 0;
}
