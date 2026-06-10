#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void ruleaza_comanda(const char *comanda) {
    pid_t pid = fork();

    if (pid == 0) {
        _exit(0);
    } else {
        wait(NULL);
        printf("Gata\n");
    }
}

int main(void) {
    ruleaza_comanda("saluta");
    ruleaza_comanda("numara");
    ruleaza_comanda("necunoscut");
    return 0;
}
