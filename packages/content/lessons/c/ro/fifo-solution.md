```c
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
            _exit(1);
        }
        char mesaj[128];
        int numar = 0;
        while (fgets(mesaj, sizeof(mesaj), in) != NULL) {
            numar++;
            printf("%d: %s", numar, mesaj);
        }
        fclose(in);
        printf("Mesaje: %d\n", numar);
        fflush(stdout);
        _exit(0);
    }

    FILE *out = fopen("mailbox", "w");
    if (out == NULL) {
        return 1;
    }
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        fprintf(out, "%s\n", linie);
    }
    fclose(out);

    waitpid(pid, NULL, 0);
    unlink("mailbox");
    printf("Cutia a fost stearsa\n");
    return 0;
}
```
