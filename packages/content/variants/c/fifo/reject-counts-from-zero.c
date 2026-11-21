#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    mkfifo("mailbox", 0644);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        FILE *in = fopen("mailbox", "r");
        if (in == NULL) {
            exit(1);
        }
        char message[128];
        int count = -1;
        while (fgets(message, sizeof(message), in) != NULL) {
            count++;
            printf("%d: %s", count, message); 
        }
        fclose(in);
        printf("Messages: %d\n", count + 1);
        exit(0);
    }

    FILE *out = fopen("mailbox", "w");
    if (out == NULL) {
        return 1;
    }
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        fprintf(out, "%s\n", line);
    }
    fclose(out);

    waitpid(pid, NULL, 0);
    unlink("mailbox");
    printf("Mailbox removed\n");
    return 0;
}
