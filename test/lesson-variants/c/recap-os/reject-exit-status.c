#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int count_words(const char *text) {
    int words = 0, in_word = 0;
    for (int i = 0; text[i]; i++) {
        if (text[i] == ' ') in_word = 0;
        else if (!in_word) { in_word = 1; words++; }
    }
    return words;
}

int main(void) {
    char text[] = "The quick brown fox jumps over the lazy dog";
    pid_t pid = fork();
    if (pid == 0) {
        exit(count_words(text));
    }
    int status;
    waitpid(pid, &status, 0);
    char buf[16];
    sprintf(buf, "%d", WEXITSTATUS(status));
    printf("Child counted: %s words\n", buf);
    return 0;
}
