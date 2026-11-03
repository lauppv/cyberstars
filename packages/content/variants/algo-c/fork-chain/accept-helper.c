#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

static void report(int level, const char *who) {
    printf("Level %d (%s): PID %d\n", level, who, (int)getpid());
}

int main(void) {
    if (fork() == 0) {
        if (fork() == 0) {
            report(2, "grandchild");
            return 0;
        }
        wait(NULL);
        report(1, "parent");
        return 0;
    }
    wait(NULL);
    report(0, "grandparent");
    return 0;
}
