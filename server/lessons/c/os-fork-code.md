#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();

    // child prints hello, parent waits then prints "child finished"

    return 0;
}
