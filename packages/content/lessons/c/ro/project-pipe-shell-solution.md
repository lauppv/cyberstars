```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

struct etapa {
    char *argumente[16];
    char *in;
    char *out;
    int adauga;
};

int cod = 0;

int imparte(char *linie, struct etapa etape[]) {
    int numar = 0;
    int nr_arg = 0;
    memset(&etape[0], 0, sizeof(struct etapa));
    char *cuvant = strtok(linie, " ");
    while (cuvant != NULL) {
        if (strcmp(cuvant, "|") == 0) {
            etape[numar].argumente[nr_arg] = NULL;
            numar++;
            nr_arg = 0;
            memset(&etape[numar], 0, sizeof(struct etapa));
        } else if (strcmp(cuvant, "<") == 0) {
            etape[numar].in = strtok(NULL, " ");
        } else if (strcmp(cuvant, ">") == 0 || strcmp(cuvant, ">>") == 0) {
            etape[numar].adauga = strcmp(cuvant, ">>") == 0;
            etape[numar].out = strtok(NULL, " ");
        } else if (nr_arg < 15) {
            etape[numar].argumente[nr_arg] = cuvant;
            nr_arg++;
        }
        cuvant = strtok(NULL, " ");
    }
    etape[numar].argumente[nr_arg] = NULL;
    return numar + 1;
}

void ruleaza(struct etapa etape[], int numar) {
    int in_fd = -1;
    if (etape[0].in != NULL) {
        in_fd = open(etape[0].in, O_RDONLY);
        if (in_fd == -1) {
            printf("%s: %s\n", etape[0].in, strerror(errno));
            cod = 1;
            return;
        }
    }

    int pipes[3][2];
    for (int i = 0; i < numar - 1; i++) {
        pipe(pipes[i]);
    }

    pid_t pids[4];
    for (int i = 0; i < numar; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            if (i == 0 && in_fd != -1) {
                dup2(in_fd, 0);
            }
            if (i > 0) {
                dup2(pipes[i - 1][0], 0);
            }
            if (i < numar - 1) {
                dup2(pipes[i][1], 1);
            }
            if (i == numar - 1 && etape[i].out != NULL) {
                int flags = O_WRONLY | O_CREAT | (etape[i].adauga ? O_APPEND : O_TRUNC);
                int out_fd = open(etape[i].out, flags, 0644);
                dup2(out_fd, 1);
                close(out_fd);
            }
            for (int j = 0; j < numar - 1; j++) {
                close(pipes[j][0]);
                close(pipes[j][1]);
            }
            if (in_fd != -1) {
                close(in_fd);
            }
            execvp(etape[i].argumente[0], etape[i].argumente);
            fprintf(stderr, "%s: comanda nu exista\n", etape[i].argumente[0]);
            _exit(127);
        }
    }

    for (int j = 0; j < numar - 1; j++) {
        close(pipes[j][0]);
        close(pipes[j][1]);
    }
    if (in_fd != -1) {
        close(in_fd);
    }
    for (int i = 0; i < numar; i++) {
        int s;
        waitpid(pids[i], &s, 0);
        if (i == numar - 1) {
            cod = WIFEXITED(s) ? WEXITSTATUS(s) : 128 + WTERMSIG(s);
        }
    }
}

int main(void) {
    char linie[256];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        struct etapa etape[4];
        int numar = imparte(linie, etape);
        char **argumente = etape[0].argumente;
        if (argumente[0] == NULL) {
            continue;
        }

        if (strcmp(argumente[0], "exit") == 0) {
            break;
        } else if (strcmp(argumente[0], "status") == 0) {
            printf("%d\n", cod);
        } else if (strcmp(argumente[0], "cd") == 0) {
            if (argumente[1] == NULL || chdir(argumente[1]) == -1) {
                printf("cd: %s: %s\n", argumente[1] ? argumente[1] : "", strerror(errno));
                cod = 1;
            } else {
                cod = 0;
            }
        } else {
            ruleaza(etape, numar);
        }
    }
    return 0;
}
```
