#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { TODO, IN_PROGRESS, DONE } Status;

typedef struct {
    char title[100];
    Status status;
} Task;

Task *create_task(const char *title) {
    Task *task = malloc(sizeof *task);
    snprintf(task->title, sizeof task->title, "%s", title);
    task->status = TODO;
    return task;
}

void update_status(Task *t, Status s) { t->status = s; }

const char *status_name(Status s) {
    switch (s) {
    case IN_PROGRESS: return "IN_PROGRESS";
    case DONE: return "DONE";
    default: return "TODO";
    }
}

void print_task(Task *t) { printf("[%s] %s\n", status_name(t->status), t->title); }

int main(void) {
    int total;
    scanf("%d", &total);
    Task **queue = malloc((total > 0 ? total : 1) * sizeof *queue);
    for (int k = 0; k < total; k++) {
        char word[100];
        int s;
        scanf("%99s %d", word, &s);
        queue[k] = create_task(word);
        update_status(queue[k], (Status)s);
    }
    for (int k = 0; k < total; k++) print_task(queue[k]);
    for (int k = 0; k < total; k++) free(queue[k]);
    free(queue);
    return 0;
}
