```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    // Bunicul forkuiaza tatal.
    pid_t p1 = fork();
    if (p1 == 0) {
        // Suntem in tata. Tatal forkuiaza nepotul.
        pid_t p2 = fork();
        if (p2 == 0) {
            // Nepotul (nivel 2) afiseaza primul — nu mai are copii de asteptat.
            printf("Nivel 2 (nepot): PID %d\n", getpid());
        } else {
            // Tatal (nivel 1) asteapta nepotul, apoi afiseaza.
            wait(NULL);
            printf("Nivel 1 (tata): PID %d\n", getpid());
        }
        return 0;
    }

    // Bunicul (nivel 0) asteapta tatal, apoi afiseaza ultimul.
    wait(NULL);
    printf("Nivel 0 (bunic): PID %d\n", getpid());
    return 0;
}
```
