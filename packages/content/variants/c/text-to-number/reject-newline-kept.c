#include <stdio.h>

int main(void) {
    char line[64], name[32];
    int minutes, jobs = 0, total = 0;
    while (fgets(line, sizeof(line), stdin) != NULL) {
        if (sscanf(line, "%31s %d", name, &minutes) == 2) { jobs++; total += minutes; }
        else printf("Bad card: %s", line);
    }
    printf("Jobs: %d\nMinutes: %d\n", jobs, total);
    return 0;
}
