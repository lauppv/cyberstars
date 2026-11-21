```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[64];
    char name[32];
    int minutes;
    int jobs = 0;
    int total = 0;

    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        if (sscanf(line, "%31s %d", name, &minutes) == 2) {
            jobs++;
            total = total + minutes;
        } else {
            printf("Bad card: %s\n", line);
        }
    }

    printf("Jobs: %d\n", jobs);
    printf("Minutes: %d\n", total);
    return 0;
}
```
