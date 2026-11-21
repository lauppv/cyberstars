#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    int lines = 0, empty = 0;
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        if (strlen(line) == 0) { empty++; lines++; break; }
        lines++;
        printf("%d: %s\n", lines, line);
    }
    printf("Lines: %d\nEmpty: %d\n", lines, empty);
    return 0;
}
