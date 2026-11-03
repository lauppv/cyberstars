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
    int evens = 0, odds = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] % 2 == 0) evens++;
        else odds++;
    }
    printf("Evens: %d\nOdds: %d\n", evens, odds);
    return 0;
}
