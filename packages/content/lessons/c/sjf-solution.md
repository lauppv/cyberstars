```c
#include <stdio.h>

int main(void) {
    int n;
    char name[20][8];
    int arrival[20], burst[20], waiting[20], done[20] = { 0 };

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", name[i], &arrival[i], &burst[i]);
    }

    int clock = 0;
    int finished = 0;
    while (finished < n) {
        int pick = -1;
        for (int i = 0; i < n; i++) {
            if (done[i] || arrival[i] > clock) {
                continue;
            }
            if (pick == -1 || burst[i] < burst[pick] ||
                (burst[i] == burst[pick] && arrival[i] < arrival[pick])) {
                pick = i;
            }
        }

        if (pick == -1) {
            int next = -1;
            for (int i = 0; i < n; i++) {
                if (!done[i] && (next == -1 || arrival[i] < arrival[next])) {
                    next = i;
                }
            }
            printf("%d-%d idle\n", clock, arrival[next]);
            clock = arrival[next];
            continue;
        }

        printf("%d-%d %s\n", clock, clock + burst[pick], name[pick]);
        waiting[pick] = clock - arrival[pick];
        clock = clock + burst[pick];
        done[pick] = 1;
        finished++;
    }

    double total_waiting = 0;
    double total_turnaround = 0;
    for (int i = 0; i < n; i++) {
        int turnaround = waiting[i] + burst[i];
        printf("%s: waiting %d, turnaround %d\n", name[i], waiting[i], turnaround);
        total_waiting = total_waiting + waiting[i];
        total_turnaround = total_turnaround + turnaround;
    }
    printf("Average waiting: %.2f\n", total_waiting / n);
    printf("Average turnaround: %.2f\n", total_turnaround / n);
    return 0;
}
```
