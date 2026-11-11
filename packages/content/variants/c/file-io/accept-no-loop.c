#include <stdio.h>

int main(void) {
    FILE *out = fopen("shift.txt", "w");
    fprintf(out, "Larsen 95\nHans 82\nBrown 98\n");
    fclose(out);

    FILE *in = fopen("shift.txt", "r");
    char who[32];
    int count;
    fscanf(in, "%31s %d", who, &count);
    printf("Technician: %s, Incidents: %d\n", who, count);
    fscanf(in, "%31s %d", who, &count);
    printf("Technician: %s, Incidents: %d\n", who, count);
    fscanf(in, "%31s %d", who, &count);
    printf("Technician: %s, Incidents: %d\n", who, count);
    fclose(in);
    return 0;
}
