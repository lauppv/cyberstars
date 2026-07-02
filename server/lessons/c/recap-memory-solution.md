```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { TODO, IN_PROGRESS, DONE } Status;

typedef struct {
    char title[100];
    Status status;
} Task;

Task *create_task(const char *title) {
    Task *t = malloc(sizeof(Task));
    strcpy(t->title, title);
    t->status = TODO;
    return t;
}

void update_status(Task *t, Status s) {
    t->status = s;
}

const char *status_name(Status s) {
    switch (s) {
        case TODO:        return "TODO";
        case IN_PROGRESS: return "IN_PROGRESS";
        case DONE:         return "DONE";
    }
    return "";
}

void print_task(Task *t) {
    printf("[%s] %s\n", status_name(t->status), t->title);
}

int main(void) {
    int n;
    scanf("%d", &n);

    Task *tasks[100];
    for (int i = 0; i < n; i++) {
        char title[100];
        int code;
        scanf("%s %d", title, &code);
        tasks[i] = create_task(title);
        update_status(tasks[i], (Status)code);
    }

    for (int i = 0; i < n; i++) {
        print_task(tasks[i]);
    }

    for (int i = 0; i < n; i++) {
        free(tasks[i]);
    }

    return 0;
}
```
