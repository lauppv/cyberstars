#include <stdio.h>
#include <string.h>

int main(void) {
    char first[50], second[50], result[100];
    scanf("%s %s", first, second);
    printf("%zu\n", strlen(first));
    sprintf(result, "%s%s", first, second);
    printf("%s\n", result);
    return 0;
}
