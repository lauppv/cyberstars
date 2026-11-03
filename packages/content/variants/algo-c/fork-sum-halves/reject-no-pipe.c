#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    static int nums[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    if (fork() == 0) return 0;
    wait(NULL);
    int sum = 0;
    for (int i = 0; i < n; i++) sum += nums[i];
    printf("Sum: %d\n", sum);
    return 0;
}
