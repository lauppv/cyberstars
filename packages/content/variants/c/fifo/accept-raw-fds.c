#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    if (mkfifo("mailbox", 0600) != 0) { /* already there */ }
    fflush(stdout);
    pid_t r = fork();
    if (r == 0) {
        int fd = open("mailbox", O_RDONLY);
        char c, line[256];
        int len = 0, n = 0;
        while (read(fd, &c, 1) == 1) {
            if (c == '\n') { line[len] = 0; printf("%d: %s\n", ++n, line); len = 0; }
            else if (len < 255) line[len++] = c;
        }
        close(fd);
        printf("Messages: %d\n", n);
        exit(0);
    }
    int fd = open("mailbox", O_WRONLY);
    char buf[256];
    while (fgets(buf, sizeof buf, stdin)) {
        size_t L = strcspn(buf, "\n");
        buf[L] = '\n';
        write(fd, buf, L + 1);
    }
    close(fd);
    waitpid(r, NULL, 0);
    unlink("mailbox");
    puts("Mailbox removed");
    return 0;
}
