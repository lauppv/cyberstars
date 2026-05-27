#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int countWords(const char \*text) {
// count words separated by spaces
return 0;
}

int main(void) {
int fd[2];
pipe(fd);

    char text[] = "The quick brown fox jumps over the lazy dog";

    pid_t pid = fork();

    // child: count words, write result to pipe
    // parent: read from pipe, print result

    return 0;

}
