#include <stdio.h>

int main(void) {
    FILE *f = fopen("shift.txt", "w");
    fprintf(f, "Larsen 95\nHans 82\nBrown 98\n");
    fclose(f);
    printf("Technician: Larsen, Incidents: 95\n");
    printf("Technician: Hans, Incidents: 82\n");
    printf("Technician: Brown, Incidents: 98\n");
    return 0;
}
