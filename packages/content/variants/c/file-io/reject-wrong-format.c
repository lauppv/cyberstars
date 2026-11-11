#include <stdio.h>

int main(void) {
    FILE *f = fopen("shift.txt", "w");
    fprintf(f, "Larsen 95\nHans 82\nBrown 98\n");
    fclose(f);
    f = fopen("shift.txt", "r");
    char name[50];
    int k;
    while (fscanf(f, "%s %d", name, &k) == 2) printf("%s: %d\n", name, k);
    fclose(f);
    return 0;
}
