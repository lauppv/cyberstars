#include <stdio.h>
#include <string.h>

int main(void) {
    char line[64];
    fgets(line, sizeof line, stdin);
    char *nl = strchr(line, '\n');
    if (nl) *nl = 0;
    unsigned long len = strlen(line);
    char *last = line + len - 1;
    printf("%s\n%lu\n%c\n%c\n", line, len, *line, *last);
    return 0;
}
