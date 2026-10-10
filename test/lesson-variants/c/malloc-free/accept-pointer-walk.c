#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int count;
    scanf("%d", &count);
    int *buf = (int *) malloc(sizeof *buf * count);
    if (buf == NULL) return 1;
    int *p = buf;
    while (p < buf + count) scanf("%d", p++);
    p = buf;
    while (p != buf + count) printf("%d\n", *p++);
    free(buf);
    buf = NULL;
    return 0;
}
