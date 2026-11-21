#include <stdio.h>

int main(void) {
    int n, arr[20], bur[20], wait[20], done[20] = {0};
    char name[20][8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%7s%d%d", name[i], &arr[i], &bur[i]);
    int t = 0;
    for (int k = 0; k < n; k++) {
        int pick = -1;
        for (int i = 0; i < n; i++)
            if (!done[i] && (pick < 0 || arr[i] <= arr[pick])) pick = i;
        if (t < arr[pick]) { printf("%d-%d idle\n", t, arr[pick]); t = arr[pick]; }
        printf("%d-%d %s\n", t, t + bur[pick], name[pick]);
        wait[pick] = t - arr[pick];
        t += bur[pick];
        done[pick] = 1;
    }
    double sw = 0, st = 0;
    for (int i = 0; i < n; i++) {
        printf("%s: waiting %d, turnaround %d\n", name[i], wait[i], wait[i] + bur[i]);
        sw += wait[i];
        st += wait[i] + bur[i];
    }
    printf("Average waiting: %.2f\nAverage turnaround: %.2f\n", sw / n, st / n);
    return 0;
}
