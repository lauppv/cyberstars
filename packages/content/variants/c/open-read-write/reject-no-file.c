#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char buf[256];
    ssize_t n;
    long size = 0;
    int fd = open("/dev/null", O_RDONLY);
    close(fd);
    while ((n = read(0, buf, sizeof(buf))) > 0) { write(1, buf, n); size += n; }
    write(1, "end of tape\n", 12);
    printf("Size: %ld bytes\n", size);
    return 0;
}
