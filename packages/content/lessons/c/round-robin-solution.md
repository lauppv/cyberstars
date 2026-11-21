```c
#include <stdio.h>

int n, q;
char name[20][8];
int arrival[20], burst[20], left[20], finish[20];
int added[20];

int queue[2000];
int front = 0, back = 0;

void add_arrived(int clock) {
    while (1) {
        int next = -1;
        for (int i = 0; i < n; i++) {
            if (!added[i] && arrival[i] <= clock &&
                (next == -1 || arrival[i] < arrival[next])) {
                next = i;
            }
        }
        if (next == -1) {
            return;
        }
        added[next] = 1;
        queue[back] = next;
        back++;
    }
}

int main(void) {
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", name[i], &arrival[i], &burst[i]);
        left[i] = burst[i];
    }

    int clock = 0;
    int finished = 0;
    add_arrived(clock);
    while (finished < n) {
        if (front == back) {
            int next = -1;
            for (int i = 0; i < n; i++) {
                if (!added[i] && (next == -1 || arrival[i] < arrival[next])) {
                    next = i;
                }
            }
            printf("%d-%d idle\n", clock, arrival[next]);
            clock = arrival[next];
            add_arrived(clock);
            continue;
        }

        int p = queue[front];
        front++;
        int slice = left[p] < q ? left[p] : q;
        printf("%d-%d %s\n", clock, clock + slice, name[p]);
        clock = clock + slice;
        left[p] = left[p] - slice;

        add_arrived(clock);
        if (left[p] > 0) {
            queue[back] = p;
            back++;
        } else {
            finish[p] = clock;
            finished++;
        }
    }

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
