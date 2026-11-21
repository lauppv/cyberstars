#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char lines[10][128];
    pid_t pids[10];
    int codes[10], n = 0;
    while (n < 10 && fgets(lines[n], sizeof lines[n], stdin)) { lines[n][strcspn(lines[n], "\n")] = 0; n++; }
    for (int i = 0; i < n; i++) {
        char *args[9]; int c = 0;
        for (char *w = strtok(lines[i], " "); w && c < 8; w = strtok(NULL, " ")) args[c++] = w;
        args[c] = NULL;
        fflush(stdout);
        if ((pids[i] = fork()) == 0) { execvp(args[0], args); exit(127); }
    }
    for (int k = 0; k < n; k++) { int st; pid_t d = wait(&st); for (int i = 0; i < n; i++) if (pids[i] == d) codes[i] = st; }
    int passed = 0;
    for (int i = 0; i < n; i++) {
        if (codes[i] == 0) { printf("%d: passed\n", i + 1); passed++; }
        else if (codes[i] == 127) printf("%d: missing\n", i + 1);
        else printf("%d: failed\n", i + 1);
    }
    printf("Passed: %d of %d\n", passed, n);
    return 0;
}
