```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    // fork() creeaza un al doilea proces identic cu primul.
    // Returneaza 0 in copil si PID-ul copilului in parinte.
    pid_t pid = fork();

    if (pid == 0) {
        // Suntem in copil: getppid() ne da PID-ul parintelui.
        printf("Copil: parintele meu este %d\n", getppid());
    } else {
        // Suntem in parinte: variabila pid tine PID-ul copilului.
        // Asteptam copilul sa termine ca sa garantam ordinea liniilor.
        wait(NULL);
        printf("Parinte: copilul meu este %d\n", pid);
    }

    return 0;
}
```
