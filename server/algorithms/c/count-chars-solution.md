```c
#include <stdio.h>

int main(void) {
    char word[1001];
    char target;

    scanf("%1000s", word);
    scanf(" %c", &target);

    int count = 0;
    for (int i = 0; word[i] != '\0'; i++) {
        if (word[i] == target) {
            count++;
        }
    }

    printf("%d\n", count);
    return 0;
}
```
