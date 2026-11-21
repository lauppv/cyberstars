#include <stdio.h>
#include <unistd.h>

int main(void) {
    char buf[16];
    ssize_t n;
    long bytes = 0, lines = 0;
    while ((n = read(0, buf, sizeof(buf))) > 0) {
        write(1, buf, sizeof(buf));
        bytes += n;
        for (ssize_t i = 0; i < n; i++) if (buf[i] == '\n') lines++;
    }
    printf("Bytes: %ld, lines: %ld\n", bytes, lines);
    return 0;
}
