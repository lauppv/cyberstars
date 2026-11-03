#include <stdio.h>
#include <string.h>

int main(void) {
    static char names[20000][32];
    static int grades[20000];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%31s %d", names[i], &grades[i]);
    for (int g = 0; g <= 100; g++) {
        for (int i = 0; i < n; i++) {
            if (grades[i] == g) printf("%s %d\n", names[i], grades[i]);
        }
    }
    return 0;
}
