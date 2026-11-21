#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

char state_of(pid_t pid) {
    char path[64];
    snprintf(path, sizeof(path), "/proc/%d/stat", pid);
    FILE *f = fopen(path, "r");
    if (!f) return '-';
    char s = '?';
    fscanf(f, "%*d %*s %c", &s);
    fclose(f);
    return s;
}

int main(void) {
    int n, codes[5];
    pid_t pids[5];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { fflush(stdout); pids[i] = fork(); if (pids[i] == 0) exit((i + 1) * 10); }
    for (int i = 0; i < n; i++) {
        siginfo_t info;
        waitid(P_PID, pids[i], &info, WEXITED);
        codes[i] = info.si_status;
        printf("child %d: %c\n", i + 1, state_of(pids[i]));
    }
    for (int i = 0; i < n; i++) { int st; waitpid(pids[i], &st, 0); printf("child %d: exit %d\n", i + 1, codes[i]); }
    for (int i = 0; i < n; i++) printf("child %d: %s\n", i + 1, state_of(pids[i]) == '-' ? "gone" : "here");
    return 0;
}
