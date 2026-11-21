```c
#include <stdio.h>
#include <stdlib.h>

struct process {
    char name[8];
    int arrival;
    int burst;
    int index;
    int waiting;
    int turnaround;
};

int by_arrival(const void *a, const void *b) {
    const struct process *x = a;
    const struct process *y = b;
    if (x->arrival != y->arrival) {
        return x->arrival < y->arrival ? -1 : 1;
    }
    return x->index < y->index ? -1 : 1;
}

int main(void) {
    int n;
    struct process p[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", p[i].name, &p[i].arrival, &p[i].burst);
        p[i].index = i;
    }

    qsort(p, n, sizeof(struct process), by_arrival);

    int clock = 0;
    for (int i = 0; i < n; i++) {
        if (clock < p[i].arrival) {
            printf("%d-%d idle\n", clock, p[i].arrival);
            clock = p[i].arrival;
        }
        printf("%d-%d %s\n", clock, clock + p[i].burst, p[i].name);
        clock = clock + p[i].burst;
        p[i].turnaround = clock - p[i].arrival;
        p[i].waiting = p[i].turnaround - p[i].burst;
    }

    struct process by_input[20];
    for (int i = 0; i < n; i++) {
        by_input[p[i].index] = p[i];
    }

    double total_waiting = 0;
    double total_turnaround = 0;
    for (int i = 0; i < n; i++) {
        printf("%s: waiting %d, turnaround %d\n", by_input[i].name,
               by_input[i].waiting, by_input[i].turnaround);
        total_waiting = total_waiting + by_input[i].waiting;
        total_turnaround = total_turnaround + by_input[i].turnaround;
    }
    printf("Average waiting: %.2f\n", total_waiting / n);
    printf("Average turnaround: %.2f\n", total_turnaround / n);
    return 0;
}
```
