```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    int lines = 0;
    int empty = 0;

    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        lines++;
        if (strlen(line) == 0) {
            empty++;
            continue;
        }
        printf("%d: %s\n", lines, line);
    }

    printf("Lines: %d\n", lines);
    printf("Empty: %d\n", empty);
    return 0;
}
```
