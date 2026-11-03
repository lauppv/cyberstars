#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

static long sum_range(const int *a, int from, int to) {
    long s = 0;
    for (int i = from; i < to; i++) s += a[i];
    return s;
}

int main(void) {
    int n;
    static int nums[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int fd[2];
    pipe(fd);
    if (fork() == 0) {
        long first = sum_range(nums, 0, n / 2);
        write(fd[1], &first, sizeof first);
        _exit(0);
    }
    long second = sum_range(nums, n / 2, n), first = 0;
    read(fd[0], &first, sizeof first);
    wait(NULL);
    printf("Sum: %ld\n", first + second);
    return 0;
}
