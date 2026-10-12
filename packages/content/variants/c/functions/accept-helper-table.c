#include <stdio.h>

static int known(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

static int apply(int x, int y, char c) {
    if (c == '+') return x + y;
    if (c == '-') return x - y;
    if (c == '*') return x * y;
    return x / y;
}

void calculator(int left, int right, char sign) {
    if (!known(sign)) {
        puts("Invalid operator");
        return;
    }
    printf("%d %c %d = %d\n", left, sign, right, apply(left, right, sign));
}

int main(void) {
    int xs[] = { 14, 10, 5, 10, 1 };
    int ys[] = { 12, 3, 4, 2, 1 };
    char ops[] = "+-*/x";
    for (int i = 0; i < 5; i++) calculator(xs[i], ys[i], ops[i]);
    return 0;
}
