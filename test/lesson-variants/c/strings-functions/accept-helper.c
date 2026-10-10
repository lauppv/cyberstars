#include <stdio.h>
#include <string.h>

static void join(char *dst, const char *a, const char *b) {
    strcpy(dst, a);
    strcat(dst, b);
}

int main(void) {
    char first[50], second[50], result[100];
    if (scanf("%49s %49s", first, second) != 2) return 1;
    int len = (int)strlen(first);
    join(result, first, second);
    printf("%d\n%s\n", len, result);
    return 0;
}
