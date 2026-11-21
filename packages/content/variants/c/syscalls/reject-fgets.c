#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    char line[6000];
    long bytes = 0, lines = 0;
    while (fgets(line, sizeof line, stdin)) {
        size_t n = strlen(line);
        write(1, line, n);
        bytes += n;
        if (n && line[n - 1] == '\n') lines++;
    }
    char c; (void)read(0, &c, 0);
    printf("Bytes: %ld, lines: %ld\n", bytes, lines);
    return 0;
}
