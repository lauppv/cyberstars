```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("PID: %d\n", getpid());
    printf("Exiting with code 0\n");
    return 0;
}
```
