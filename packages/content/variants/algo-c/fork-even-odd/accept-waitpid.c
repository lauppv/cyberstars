#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    static int nums[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int channel[2];
    if (pipe(channel) != 0) return 1;
    pid_t child = fork();
    if (child == 0) {
        int evens = 0;
        for (int i = 0; i < n; i++) evens += (nums[i] & 1) == 0;
        close(channel[0]);
        write(channel[1], &evens, sizeof evens);
        _exit(0);
    }
    close(channel[1]);
    int odds = 0, evens = 0;
    for (int i = 0; i < n; i++) odds += (nums[i] & 1) != 0;
    read(channel[0], &evens, sizeof evens);
    waitpid(child, NULL, 0);
    printf("Evens: %d\nOdds: %d\n", evens, odds);
    return 0;
}
