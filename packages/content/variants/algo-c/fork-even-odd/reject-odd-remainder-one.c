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
    if (fork() == 0) {
        int evens = 0;
        for (int i = 0; i < n; i++) evens += nums[i] % 2 == 0;
        write(p[1], &evens, sizeof evens);
        return 0;
    }
    int odds = 0, evens = 0;
    for (int i = 0; i < n; i++) odds += nums[i] % 2 == 1;
    read(p[0], &evens, sizeof evens);
    wait(NULL);
    printf("Evens: %d\nOdds: %d\n", evens, odds);
    return 0;
}
