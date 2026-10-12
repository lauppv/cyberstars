#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { TODO, IN_PROGRESS, DONE } Status;

typedef struct {
    char title[100];
    Status status;
} Task;

Task *create_task(const char *title) {
    Task *t = (Task *)malloc(sizeof(Task));
    strcpy(t->title, title);
    t->status = TODO;
    return t;
}

void update_status(Task *t, Status s) {
    t->status = s;
}

const char *status_name(Status s) {
    const char *name = "";
    switch (s) {
    case TODO: name = "TODO"; break;
    case IN_PROGRESS: name = "IN_PROGRESS"; break;
    case DONE: name = "DONE"; break;
    }
    return name;
}

void print_task(Task *t) {
    printf("[%s] %s\n", status_name(t->status), t->title);
}

int main(void) {
    int n, i = 0;
    Task *list[100];
    scanf("%d", &n);
    while (i < n) {
        char title[100];
        int code;
        scanf("%s %d", title, &code);
        list[i] = create_task(title);
        if (code != TODO) update_status(list[i], (Status)code);
        i++;
    }
    i = 0;
    while (i < n) {
        print_task(list[i]);
        free(list[i]);
        i++;
    }
    return 0;
}
