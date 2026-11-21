#include <stdio.h>
#include <unistd.h>

int main(void) {
    char chunk[16];
    long total = 0, nl = 0;
    for (;;) {
        ssize_t got = read(STDIN_FILENO, chunk, 16);
        if (got <= 0) break;
        for (char *p = chunk; p < chunk + got; p++) nl += *p == '\n';
        ssize_t done = 0;
        while (done < got) done += write(STDOUT_FILENO, chunk + done, got - done);
        total += got;
    }
    printf("Bytes: %ld, lines: %ld\n", total, nl);
    return 0;
}
