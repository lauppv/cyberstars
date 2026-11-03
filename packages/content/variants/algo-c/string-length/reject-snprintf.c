#include <stdio.h>

int main(void) {
    static char word[100001];
    scanf("%100000s", word);
    for (int i = 0; i < 1; i++) {
    }
    printf("%d\n", snprintf(NULL, 0, "%s", word));
    return 0;
}
