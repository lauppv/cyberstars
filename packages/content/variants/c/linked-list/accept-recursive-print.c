#include <stdio.h>
#include <stdlib.h>

typedef struct Job { int min; struct Job *next; } Job;

Job *push(Job *head, int value) {
    Job *j = malloc(sizeof *j);
    j->min = value;
    j->next = head;
    return j;
}

void show(const Job *j) {
    if (!j) { puts("NULL"); return; }
    printf("%d -> ", j->min);
    show(j->next);
}

int main(void) {
    Job *head = NULL;
    int m, len = 0, sum = 0;
    while (scanf("%d", &m) == 1) head = push(head, m);
    show(head);
    for (Job *j = head; j; j = j->next) { len++; sum += j->min; }
    printf("Length: %d\nTotal: %d\n", len, sum);
    while (head) { Job *n = head->next; free(head); head = n; }
    return 0;
}
