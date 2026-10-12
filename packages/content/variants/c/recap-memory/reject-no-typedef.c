#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum Status { TODO, IN_PROGRESS, DONE };

struct Task {
    char title[100];
    enum Status status;
};

struct Task *create_task(const char *title) {
    struct Task *t = (struct Task *)malloc(sizeof(struct Task));
    strcpy(t->title, title);
    t->status = TODO;
    return t;
}

void update_status(struct Task *t, enum Status s) {
    t->status = s;
}

const char *status_name(enum Status s) {
    const char *name = "";
    switch (s) {
    case TODO: name = "TODO"; break;
    case IN_PROGRESS: name = "IN_PROGRESS"; break;
    case DONE: name = "DONE"; break;
    }
    return name;
}

void print_task(struct Task *t) {
    printf("[%s] %s\n", status_name(t->status), t->title);
}

int main(void) {
    int n, i = 0;
    struct Task *list[100];
    scanf("%d", &n);
    while (i < n) {
        char title[100];
        int code;
        scanf("%s %d", title, &code);
        list[i] = create_task(title);
        if (code != TODO) update_status(list[i], (enum Status)code);
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
