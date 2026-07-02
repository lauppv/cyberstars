```c
#include <stdio.h>

int main(void) {
    char word[1001];
    scanf("%1000s", word);

    int length = 0;
    while (word[length] != '\0') {
        length++;
    }

    printf("%d\n", length);
    return 0;
}
```
