#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    FILE *out = fopen("mailbox.txt", "w");
    char line[128];
    while (fgets(line, sizeof line, stdin)) { line[strcspn(line, "\n")] = 0; fprintf(out, "%s\n", line); }
    fclose(out);
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        FILE *in = fopen("mailbox.txt", "r");
        char m[128]; int n = 0;
        while (fgets(m, sizeof m, in)) printf("%d: %s", ++n, m);
        fclose(in);
        printf("Messages: %d\n", n);
        exit(0);
    }
    waitpid(pid, NULL, 0);
    unlink("mailbox.txt");
    printf("Mailbox removed\n");
    (void)mkfifo;
    return 0;
}
