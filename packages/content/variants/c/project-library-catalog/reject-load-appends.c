#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct book {
    int id;
    char title[32];
    int year;
    int out;
    struct book *next;
};

struct book *head = NULL;

struct book *find(int id) {
    for (struct book *b = head; b != NULL; b = b->next) {
        if (b->id == id) {
            return b;
        }
    }
    return NULL;
}

void add(int id, const char *title, int year, int out) {
    struct book *b = malloc(sizeof(struct book));
    b->id = id;
    strcpy(b->title, title);
    b->year = year;
    b->out = out;
    b->next = head;
    head = b;
}

void remove_book(int id) {
    struct book *prev = NULL;
    struct book *b = head;
    while (b != NULL && b->id != id) {
        prev = b;
        b = b->next;
    }
    if (b == NULL) {
        return;
    }
    if (prev == NULL) {
        head = b->next;
    } else {
        prev->next = b->next;
    }
    free(b);
}

void clear(void) {
    while (head != NULL) {
        struct book *next = head->next;
        free(head);
        head = next;
    }
}

int by_year(const void *a, const void *b) {
    const struct book *x = *(struct book *const *)a;
    const struct book *y = *(struct book *const *)b;
    if (x->year != y->year) {
        return x->year < y->year ? -1 : 1;
    }
    int t = strcmp(x->title, y->title);
    if (t != 0) {
        return t;
    }
    return x->id < y->id ? -1 : 1;
}

void list(void) {
    struct book *all[300];
    int n = 0;
    for (struct book *b = head; b != NULL; b = b->next) {
        all[n] = b;
        n++;
    }
    if (n == 0) {
        printf("Empty catalog\n");
        return;
    }
    qsort(all, n, sizeof(struct book *), by_year);
    for (int i = 0; i < n; i++) {
        printf("%d %d %s%s\n", all[i]->id, all[i]->year, all[i]->title,
               all[i]->out ? " (out)" : "");
    }
}

void save(const char *file) {
    FILE *f = fopen(file, "w");
    if (f == NULL) {
        printf("Cannot open %s\n", file);
        return;
    }
    for (struct book *b = head; b != NULL; b = b->next) {
        fprintf(f, "%d %s %d %d\n", b->id, b->title, b->year, b->out);
    }
    fclose(f);
}

void load(const char *file) {
    FILE *f = fopen(file, "r");
    if (f == NULL) {
        printf("Cannot open %s\n", file);
        return;
    }
    int id, year, out;
    char title[32];
    while (fscanf(f, "%d %31s %d %d", &id, title, &year, &out) == 4) {
        add(id, title, year, out);
    }
    fclose(f);
}

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        char command[16];
        char word[64];
        int id;
        int year;
        if (sscanf(line, "%15s", command) != 1) {
            continue;
        }

        if (strcmp(command, "add") == 0 &&
            sscanf(line, "%*s %d %31s %d", &id, word, &year) == 3) {
            if (find(id) != NULL) {
                printf("Book %d already exists\n", id);
            } else {
                add(id, word, year, 0);
            }
        } else if (strcmp(command, "list") == 0) {
            list();
        } else if (strcmp(command, "save") == 0 && sscanf(line, "%*s %63s", word) == 1) {
            save(word);
        } else if (strcmp(command, "load") == 0 && sscanf(line, "%*s %63s", word) == 1) {
            load(word);
        } else if (sscanf(line, "%*s %d", &id) == 1) {
            struct book *b = find(id);
            if (b == NULL) {
                printf("No book %d\n", id);
            } else if (strcmp(command, "remove") == 0) {
                remove_book(id);
            } else if (strcmp(command, "borrow") == 0) {
                if (b->out) {
                    printf("Book %d is already out\n", id);
                } else {
                    b->out = 1;
                }
            } else if (strcmp(command, "return") == 0) {
                if (!b->out) {
                    printf("Book %d is not out\n", id);
                } else {
                    b->out = 0;
                }
            }
        }
    }
    clear();
    return 0;
}
