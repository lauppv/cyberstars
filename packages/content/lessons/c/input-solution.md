```c
#include <stdio.h>

int main(void) {
    char name[64];
    int age;

    scanf("%s", name);
    scanf("%d", &age);

    printf("Hello %s, you are %d years old. Next year you will be %d\n", name, age, age + 1);
    return 0;
}
```
