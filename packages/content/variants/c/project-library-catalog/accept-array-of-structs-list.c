#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Book { int id, year, out; char title[32]; struct Book *next; } Book;
static Book *books;

static Book **slot(int id) {
    Book **pp = &books;
    while (*pp && (*pp)->id != id) pp = &(*pp)->next;
    return pp;
}

static void push(int id, const char *t, int y, int o) {
    Book **end = slot(-1);
    *end = calloc(1, sizeof **end);
    (*end)->id = id; (*end)->year = y; (*end)->out = o;
    snprintf((*end)->title, sizeof (*end)->title, "%s", t);
}

static void wipe(void) { while (books) { Book *n = books->next; free(books); books = n; } }

static int cmp(const void *a, const void *b) {
    const Book *x = *(Book *const *)a, *y = *(Book *const *)b;
    if (x->year != y->year) return (x->year > y->year) - (x->year < y->year);
    int t = strcmp(x->title, y->title);
    return t ? t : (x->id > y->id) - (x->id < y->id);
}

int main(void) {
    char cmd[16], s[64];
    int id, y;
    while (scanf("%15s", cmd) == 1) {
        if (!strcmp(cmd, "list")) {
            Book *v[300]; int n = 0;
            for (Book *b = books; b; b = b->next) v[n++] = b;
            if (!n) { puts("Empty catalog"); continue; }
            qsort(v, n, sizeof *v, cmp);
            for (int i = 0; i < n; i++) printf("%d %d %s%s\n", v[i]->id, v[i]->year, v[i]->title, v[i]->out ? " (out)" : "");
        } else if (!strcmp(cmd, "save") || !strcmp(cmd, "load")) {
            scanf("%63s", s);
            FILE *f = fopen(s, cmd[0] == 's' ? "w" : "r");
            if (!f) { printf("Cannot open %s\n", s); continue; }
            if (cmd[0] == 's') for (Book *b = books; b; b = b->next) fprintf(f, "%d %s %d %d\n", b->id, b->title, b->year, b->out);
            else { wipe(); char t[32]; int o; while (fscanf(f, "%d %31s %d %d", &id, t, &y, &o) == 4) push(id, t, y, o); }
            fclose(f);
        } else if (!strcmp(cmd, "add")) {
            scanf("%d %31s %d", &id, s, &y);
            if (*slot(id)) printf("Book %d already exists\n", id);
            else push(id, s, y, 0);
        } else {
            scanf("%d", &id);
            Book **pp = slot(id);
            if (!*pp) { printf("No book %d\n", id); continue; }
            if (!strcmp(cmd, "remove")) { Book *g = *pp; *pp = g->next; free(g); }
            else if (!strcmp(cmd, "borrow")) { if ((*pp)->out) printf("Book %d is already out\n", id); else (*pp)->out = 1; }
            else { if (!(*pp)->out) printf("Book %d is not out\n", id); else (*pp)->out = 0; }
        }
    }
    wipe();
    return 0;
}
