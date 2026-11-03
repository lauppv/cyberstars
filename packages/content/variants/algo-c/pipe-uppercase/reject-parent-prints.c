#include <ctype.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char word[128];
    int fd[2];
    scanf("%127s", word);
    pipe(fd);
    for (int i = 0; word[i]; i++) word[i] = toupper((unsigned char)word[i]);
    printf("%s\n", word);
    return 0;
}
