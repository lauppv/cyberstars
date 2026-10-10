#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

static const char *reply(const char *cmd, char *buf) {
    if (!strcmp(cmd, "time")) return "12:04";
    if (!strcmp(cmd, "space")) return "128K free";
    sprintf(buf, "Unknown command: %s", cmd);
    return buf;
}

void run_command(const char *command) {
    char buf[96];
    switch (fork()) {
    case 0:
        puts(reply(command, buf));
        fflush(stdout);
        _exit(0);
    default:
        wait(NULL);
        puts("Done");
        fflush(stdout);
    }
}

int main(void) {
    char word[64];
    for (;;) {
        if (scanf("%63s", word) != 1) break;
        if (strcmp(word, "exit") == 0) break;
        run_command(word);
    }
    return 0;
}
