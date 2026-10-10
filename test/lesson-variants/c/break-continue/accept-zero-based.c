#include <stdio.h>

int main(void) {
    int s, a;
    scanf("%d", &s);
    scanf("%d", &a);
    for (int k = 0; k < 20; k++) {
        int num = k + 1;
        if (num == s)
            continue;
        else if (num == a)
            break;
        printf("%d\n", num);
    }
    return 0;
}
