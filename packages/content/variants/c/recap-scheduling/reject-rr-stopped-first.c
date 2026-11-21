#include <stdio.h>

int n, q;
char name[20][8];
int arrival[20], burst[20];

int earlier(int a, int b) {
    return arrival[a] < arrival[b];
}

int next_arrival(int taken[]) {
    int next = -1;
    for (int i = 0; i < n; i++) {
        if (!taken[i] && (next == -1 || earlier(i, next))) {
            next = i;
        }
    }
    return next;
}

int fcfs(void) {
    int taken[20] = { 0 };
    int clock = 0;
    int total = 0;
    for (int k = 0; k < n; k++) {
        int p = next_arrival(taken);
        taken[p] = 1;
        if (clock < arrival[p]) {
            clock = arrival[p];
        }
        total = total + clock - arrival[p];
        clock = clock + burst[p];
    }
    return total;
}

int sjf(void) {
    int done[20] = { 0 };
    int clock = 0;
    int total = 0;
    int finished = 0;
    while (finished < n) {
        int pick = -1;
        for (int i = 0; i < n; i++) {
            if (done[i] || arrival[i] > clock) {
                continue;
            }
            if (pick == -1 || burst[i] < burst[pick] ||
                (burst[i] == burst[pick] && earlier(i, pick))) {
                pick = i;
            }
        }
        if (pick == -1) {
            clock = arrival[next_arrival(done)];
            continue;
        }
        total = total + clock - arrival[pick];
        clock = clock + burst[pick];
        done[pick] = 1;
        finished++;
    }
    return total;
}

int round_robin(void) {
    int added[20] = { 0 };
    int left[20];
    int queue[2000];
    int front = 0, back = 0;
    int clock = 0;
    int total = 0;
    int finished = 0;
    for (int i = 0; i < n; i++) {
        left[i] = burst[i];
    }

    while (finished < n) {
        int p;
        while ((p = next_arrival(added)) != -1 && arrival[p] <= clock) {
            added[p] = 1;
            queue[back] = p;
            back++;
        }
        if (front == back) {
            clock = arrival[next_arrival(added)];
            continue;
        }
        p = queue[front];
        front++;
        int slice = left[p] < q ? left[p] : q;
        clock = clock + slice;
        left[p] = left[p] - slice;

        int a;
        if (left[p] > 0) {
            queue[back] = p;
            back++;
        }
        while ((a = next_arrival(added)) != -1 && arrival[a] <= clock) {
            added[a] = 1;
            queue[back] = a;
            back++;
        }
        if (left[p] == 0) {
            total = total + clock - arrival[p] - burst[p];
            finished++;
        }
    }
    return total;
}

int main(void) {
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", name[i], &arrival[i], &burst[i]);
    }

    double averages[3];
    averages[0] = (double)fcfs() / n;
    averages[1] = (double)sjf() / n;
    averages[2] = (double)round_robin() / n;
    const char *names[3] = { "FCFS", "SJF", "RR" };

    int best = 0;
    for (int i = 0; i < 3; i++) {
        printf("%s: %.2f\n", names[i], averages[i]);
        if (averages[i] < averages[best]) {
            best = i;
        }
    }
    printf("Best: %s\n", names[best]);
    return 0;
}
