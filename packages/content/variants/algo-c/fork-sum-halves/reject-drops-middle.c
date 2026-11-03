#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    static int nums[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int p[2];
    pipe(p);
    int mid = n / 2;
    if (fork() == 0) {
        int s = 0;
        for (int i = 0; i < mid; i++) s += nums[i];
        write(p[1], &s, sizeof s);
        return 0;
    }
    int s2 = 0, s1 = 0;
    for (int i = mid + 1; i < n; i++) s2 += nums[i];
    read(p[0], &s1, sizeof s1);
    wait(NULL);
    printf("Sum: %d\n", s1 + s2);
    return 0;
}
