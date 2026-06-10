#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    char phone[20];
} Contact;

void addContact(Contact *book, int *count, const char *name, const char *phone) {
}

void searchContact(Contact *book, int count, const char *query) {
}

int main(void) {
    Contact book[10];
    int count = 0;

    addContact(book, &count, "Tommy", "0722111222");
    addContact(book, &count, "Lance", "0733222333");
    addContact(book, &count, "Ken", "0744333444");

    searchContact(book, count, "Lance");
    searchContact(book, count, "Diaz");

    return 0;
}
