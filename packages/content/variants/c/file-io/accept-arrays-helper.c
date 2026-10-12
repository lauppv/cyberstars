#include <stdio.h>

static void write_log(const char *path) {
    const char *names[] = { "Enescu", "Vlad", "Dobre" };
    int counts[] = { 95, 82, 98 };
    FILE *fp = fopen(path, "w");
    for (int i = 0; i < 3; i++) fprintf(fp, "%s %d\n", names[i], counts[i]);
    fclose(fp);
}

int main(void) {
    write_log("shift.txt");
    FILE *fp = fopen("shift.txt", "r");
    if (!fp) return 1;
    char tech[50];
    int n;
    for (int i = 0; i < 3 && fscanf(fp, "%49s %d", tech, &n) == 2; i++)
        printf("Technician: %s, Incidents: %d\n", tech, n);
    fclose(fp);
    return 0;
}
