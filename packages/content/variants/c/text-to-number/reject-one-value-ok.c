#include <stdio.h>
#include <string.h>

int main(void) {
    char line[64], name[32];
    int minutes, jobs = 0, total = 0;
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        minutes = 0;
        if (sscanf(line, "%31s %d", name, &minutes) >= 1) { jobs++; total += minutes; }
        else printf("Bad card: %s\n", line);
    }
    printf("Jobs: %d\nMinutes: %d\n", jobs, total);
    return 0;
}
