#include <stdio.h>

int find_max(int grades[], int n) {
    if (n == 1) return grades[0];
    int rest = find_max(grades + 1, n - 1);
    return grades[0] > rest ? grades[0] : rest;
}

int count_passing(int grades[], int n) {
    int c = 0;
    for (int *p = grades; p < grades + n; p++) {
        if (*p < 50) {
            continue;
        }
        c++;
    }
    return c;
}

int find_first_fail(int grades[], int n) {
    int answer = -1;
    for (int j = 0; j < n; j++) {
        if (grades[j] < 50) {
            answer = grades[j];
            break;
        }
    }
    return answer;
}

int main(void) {
    int n, g[100];
    scanf("%d", &n);
    for (int j = 0; j < n; j++) scanf("%d", g + j);
    printf("Passing: %d\n", count_passing(g, n));
    printf("Highest: %d\n", find_max(g, n));
    printf("First fail: %d\n", find_first_fail(g, n));
    return 0;
}
