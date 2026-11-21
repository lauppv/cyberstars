#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char buf[256];
    ssize_t n;
    int fd = open("copy.txt", O_WRONLY | O_CREAT, 0644);
    while ((n = read(0, buf, sizeof(buf))) > 0) write(fd, buf, n);
    close(fd);
    fd = open("copy.txt", O_WRONLY | O_APPEND);
    write(fd, "end of tape\n", 12);
    close(fd);
    long size = 0;
    fd = open("copy.txt", O_RDONLY);
    while ((n = read(fd, buf, sizeof(buf))) > 0) { write(1, buf, n); size += n; }
    close(fd);
    printf("Size: %ld bytes\n", size);
    return 0;
}
