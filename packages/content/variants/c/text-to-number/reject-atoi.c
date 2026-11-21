#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(void) {
    char line[64];
    int jobs = 0, total = 0;
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char *space = strchr(line, ' ');
        int minutes = space ? atoi(space + 1) : 0;
        if (minutes > 0) { jobs++; total += minutes; }
        else printf("Bad card: %s\n", line);
    }
    printf("Jobs: %d\nMinutes: %d\n", jobs, total);
    return 0;
}
