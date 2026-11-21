#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[256];
    int n = 0, blank = 0;
    while (fgets(buf, sizeof buf, stdin)) {
        n++;
        size_t len = strlen(buf);
        if (len > 0 && buf[len - 1] == '\n') buf[--len] = '\0';
        if (len == 0) { blank++; continue; }
        printf("%d: %s\n", n, buf);
    }
    printf("Lines: %d\nEmpty: %d\n", n, blank);
    return 0;
}
