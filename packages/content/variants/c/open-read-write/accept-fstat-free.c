#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

static void copy(int from, int to, long *count) {
    char b[100];
    ssize_t n;
    while ((n = read(from, b, sizeof b)) > 0) {
        if (to >= 0) write(to, b, n);
        if (count) *count += n;
    }
}

int main(void) {
    int out = open("copy.txt", O_CREAT | O_TRUNC | O_WRONLY, 0600);
    copy(0, out, NULL);
    close(out);
    int app = open("copy.txt", O_APPEND | O_WRONLY);
    const char *stamp = "end of tape\n";
    write(app, stamp, strlen(stamp));
    close(app);
    long total = 0;
    int in = open("copy.txt", O_RDONLY);
    copy(in, 1, &total);
    close(in);
    printf("Size: %ld bytes\n", total);
    return 0;
}
