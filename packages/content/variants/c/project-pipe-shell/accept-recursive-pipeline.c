#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

static int last;

/* Runs stages [from, n) with stdin = in_fd; returns the pid of the last stage. */
static pid_t launch(char **words[], int n, int from, int in_fd, const char *out, int app) {
    int p[2] = { -1, -1 };
    if (from < n - 1) pipe(p);
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        if (in_fd >= 0) { dup2(in_fd, 0); close(in_fd); }
        if (p[1] >= 0) { dup2(p[1], 1); close(p[0]); close(p[1]); }
        else if (out) {
            int fd = open(out, O_WRONLY | O_CREAT | (app ? O_APPEND : O_TRUNC), 0644);
            dup2(fd, 1);
            close(fd);
        }
        execvp(words[from][0], words[from]);
        fprintf(stderr, "%s: command not found\n", words[from][0]);
        _exit(127);
    }
    if (in_fd >= 0) close(in_fd);
    if (p[1] < 0) return pid;
    close(p[1]);
    pid_t rest = launch(words, n, from + 1, p[0], out, app);
    waitpid(pid, NULL, 0);
    return rest;
}

int main(void) {
    char buf[512];
    while (fgets(buf, sizeof buf, stdin)) {
        char *tok[64];
        int nt = 0;
        for (char *t = strtok(buf, " \n"); t && nt < 63; t = strtok(NULL, " \n")) tok[nt++] = t;
        tok[nt] = NULL;
        if (!nt) continue;
        if (!strcmp(tok[0], "exit")) break;
        if (!strcmp(tok[0], "status")) { printf("%d\n", last); continue; }
        if (!strcmp(tok[0], "cd")) {
            if (chdir(tok[1]) != 0) { printf("cd: %s: %s\n", tok[1], strerror(errno)); last = 1; }
            else last = 0;
            continue;
        }
        char **stage[4];
        int ns = 0;
        const char *in = NULL, *out = NULL;
        int app = 0;
        char *argv[64];
        int na = 0;
        stage[ns++] = argv;
        for (int i = 0; i < nt; i++) {
            if (!strcmp(tok[i], "|")) { argv[na++] = NULL; stage[ns++] = argv + na; }
            else if (!strcmp(tok[i], "<")) in = tok[++i];
            else if (!strcmp(tok[i], ">") || !strcmp(tok[i], ">>")) { app = tok[i][1] == '>'; out = tok[++i]; }
            else argv[na++] = tok[i];
        }
        argv[na] = NULL;
        int in_fd = -1;
        if (in && (in_fd = open(in, O_RDONLY)) < 0) { printf("%s: %s\n", in, strerror(errno)); last = 1; continue; }
        pid_t tail = launch(stage, ns, 0, in_fd, out, app);
        int st;
        waitpid(tail, &st, 0);
        last = WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st);
    }
    return 0;
}
