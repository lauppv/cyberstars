```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int nums[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }

    int p[2];
    pipe(p);

    // Split the array: the first n/2 elements go to the child, the rest to the parent.
    int mid = n / 2;

    pid_t pid = fork();
    if (pid == 0) {
        // Child: sum of the first half.
        close(p[0]);
        int sum1 = 0;
        for (int i = 0; i < mid; i++) {
            sum1 += nums[i];
        }
        write(p[1], &sum1, sizeof(int));
        close(p[1]);
        return 0;
    }

    // Parent: sum of the second half, in parallel with the child.
    close(p[1]);
    int sum2 = 0;
    for (int i = mid; i < n; i++) {
        sum2 += nums[i];
    }

    // Wait for the child, then read its partial sum from the pipe.
    wait(NULL);
    int sum1;
    read(p[0], &sum1, sizeof(int));
    close(p[0]);

    printf("Sum: %d\n", sum1 + sum2);
    return 0;
}
```
