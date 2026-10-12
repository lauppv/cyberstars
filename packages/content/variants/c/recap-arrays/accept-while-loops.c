#include <stdio.h>

int count_passing(int grades[], int n) {
    int ok = 0, i = -1;
    while (++i < n) {
        if (grades[i] < 50) continue;
        ok++;
    }
    return ok;
}

int find_max(int grades[], int n) {
    int best = -1, i = 0;
    while (i < n) {
        if (grades[i] > best) best = grades[i];
        i++;
    }
    return best;
}

int find_first_fail(int grades[], int n) {
    int i = 0;
    while (i < n) {
        if (grades[i] < 50) break;
        i++;
    }
    return i < n ? grades[i] : -1;
}

int main(void) {
    int count;
    if (scanf("%d", &count) != 1) return 1;
    int marks[count];
    int k = 0;
    while (k < count && scanf("%d", &marks[k]) == 1) k++;
    printf("Passing: %d\nHighest: %d\nFirst fail: %d\n",
           count_passing(marks, count), find_max(marks, count), find_first_fail(marks, count));
    return 0;
}
