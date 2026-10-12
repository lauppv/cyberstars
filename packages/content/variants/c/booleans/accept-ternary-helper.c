#include <stdio.h>

static int may_enter(int emp, int day, int guest, int invite) {
    return (emp && day) || (guest && invite);
}

int main(void) {
    int v[4];
    for (int i = 0; i < 4; i++) scanf("%d", &v[i]);
    puts(may_enter(v[0], v[1], v[2], v[3]) ? "Access granted" : "Access denied");
    return 0;
}
