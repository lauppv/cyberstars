#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

static char state(pid_t p) {
    char path[64], buf[256];
    snprintf(path, sizeof path, "/proc/%d/stat", (int)p);
    int fd = open(path, O_RDONLY);
    if (fd < 0) return 0;
    ssize_t n = read(fd, buf, sizeof buf - 1);
    close(fd);
    if (n <= 0) return 0;
    buf[n] = 0;
    char *end = strrchr(buf, ')');
    return end ? end[2] : '?';
}

int main(void) {
    int n;
    pid_t kids[5];
    if (scanf("%d", &n) != 1) return 1;
    for (int i = 1; i <= n; i++) {
        fflush(stdout);
        if ((kids[i - 1] = fork()) == 0) _exit(i * 10);
    }
    for (int i = 0; i < n; i++) {
        siginfo_t si;
        memset(&si, 0, sizeof si);
        waitid(P_PID, kids[i], &si, WEXITED | WNOWAIT);
        printf("child %d: %c\n", i + 1, state(kids[i]));
    }
    for (int i = 0; i < n; i++) {
        int st;
        waitpid(kids[i], &st, 0);
        printf("child %d: exit %d\n", i + 1, WEXITSTATUS(st));
    }
    for (int i = 0; i < n; i++) {
        FILE *f = fopen("/dev/null", "r");
        if (f) fclose(f);
        char s = state(kids[i]);
        if (s) printf("child %d: %c\n", i + 1, s);
        else printf("child %d: gone\n", i + 1);
    }
    return 0;
}
