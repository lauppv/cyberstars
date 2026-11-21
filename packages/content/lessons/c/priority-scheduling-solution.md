```c
#include <stdio.h>

int main(void) {
    int n;
    char name[20][8];
    int arrival[20], burst[20], priority[20], left[20], finish[20];

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d %d", name[i], &arrival[i], &burst[i], &priority[i]);
        left[i] = burst[i];
    }

    int finished = 0;
    int last = -2;
    int start = 0;
    int t = 0;
    while (finished < n) {
        int pick = -1;
        for (int i = 0; i < n; i++) {
            if (left[i] == 0 || arrival[i] > t) {
                continue;
            }
            if (pick == -1 || priority[i] < priority[pick] ||
                (priority[i] == priority[pick] && arrival[i] < arrival[pick])) {
                pick = i;
            }
        }

        if (pick != last) {
            if (last != -2) {
                printf("%d-%d %s\n", start, t, last == -1 ? "idle" : name[last]);
            }
            last = pick;
            start = t;
        }

        if (pick != -1) {
            left[pick]--;
            if (left[pick] == 0) {
                finish[pick] = t + 1;
                finished++;
            }
        }
        t++;
    }
    printf("%d-%d %s\n", start, t, name[last]);

    double total_waiting = 0;
    double total_turnaround = 0;
    for (int i = 0; i < n; i++) {
        int turnaround = finish[i] - arrival[i];
        int waiting = turnaround - burst[i];
        printf("%s: waiting %d, turnaround %d\n", name[i], waiting, turnaround);
        total_waiting = total_waiting + waiting;
        total_turnaround = total_turnaround + turnaround;
    }
    printf("Average waiting: %.2f\n", total_waiting / n);
    printf("Average turnaround: %.2f\n", total_turnaround / n);
    return 0;
}
```
