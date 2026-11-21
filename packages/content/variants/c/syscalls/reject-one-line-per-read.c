#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    char buf[16];
    ssize_t n;
    long bytes = 0, lines = 0;
    while ((n = read(0, buf, sizeof(buf))) > 0) {
        write(1, buf, n);
        bytes += n;
        if (memchr(buf, '\n', n)) lines++;
    }
    printf("Bytes: %ld, lines: %ld\n", bytes, lines);
    return 0;
}
