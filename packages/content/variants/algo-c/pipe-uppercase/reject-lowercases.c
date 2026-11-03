#include <ctype.h>
#include <stdio.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    char word[128];
    scanf("%127s", word);
    int p[2];
    pipe(p);
    if (fork() == 0) {
        close(p[1]);
        char buf[128];
        int n = read(p[0], buf, sizeof buf - 1);
        buf[n] = '\0';
        for (int i = 0; buf[i]; i++) buf[i] = tolower((unsigned char)buf[i]);
        printf("%s\n", buf);
        return 0;
    }
    close(p[0]);
    write(p[1], word, strlen(word));
    close(p[1]);
    wait(NULL);
    return 0;
}
