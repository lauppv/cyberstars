#include <stdio.h>
#include <string.h>

typedef struct {
    char name[64];
    char phone[32];
} Contact;

void add_contact(Contact *book, int *count, const char *name, const char *phone) {
    strcpy(book[*count].name, name);
    strcpy(book[*count].phone, phone);
    (*count)++;
}

void find_contact(Contact *book, int count, const char *query) {
    int at = -1;
    for (int k = 0; k < count && at < 0; k++)
        if (!strcmp(book[k].name, query)) at = k;
    if (at >= 0) printf("Found: %s - %s\n", book[at].name, book[at].phone);
    else printf("Not found: %s\n", query);
}

int main(void) {
    static Contact directory[100];
    int stored = 0, n, q;
    char who[64], num[32];
    scanf("%d", &n);
    while (n--) {
        scanf("%s %s", who, num);
        add_contact(directory, &stored, who, num);
    }
    scanf("%d", &q);
    while (q--) {
        scanf("%s", who);
        find_contact(directory, stored, who);
    }
    return 0;
}
