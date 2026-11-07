```c
#include <stdio.h>
#include <string.h>

#define SLOTS 101
#define EMPTY 0
#define USED 1
#define DELETED 2

struct Record {
    char key[16];
    int value;
    int state;
};

FILE *db;

void read_slot(int i, struct Record *r) {
    fseek(db, (long)i * sizeof(struct Record), SEEK_SET);
    fread(r, sizeof(struct Record), 1, db);
}

void write_slot(int i, const struct Record *r) {
    fseek(db, (long)i * sizeof(struct Record), SEEK_SET);
    fwrite(r, sizeof(struct Record), 1, db);
}

int hash(const char *key) {
    int h = 0;
    for (const char *c = key; *c; c++) h = (h * 31 + (unsigned char)*c) % SLOTS;
    return h;
}

/* the slot holding key, or -1; *checked counts the slots looked at */
int find(const char *key, int *checked) {
    struct Record r;
    int i = hash(key);
    for (*checked = 1; *checked <= SLOTS; (*checked)++, i = (i + 1) % SLOTS) {
        read_slot(i, &r);
        if (r.state == EMPTY) return -1;
        if (r.state == USED && strcmp(r.key, key) == 0) return i;
    }
    (*checked)--;
    return -1;
}

int main(void) {
    db = fopen("store.db", "w+b");
    if (!db) {
        printf("Cannot open store.db\n");
        return 0;
    }
    struct Record blank;
    memset(&blank, 0, sizeof blank);
    for (int i = 0; i < SLOTS; i++) write_slot(i, &blank);
    printf("Store ready: %d slots, %ld bytes\n", SLOTS, (long)(SLOTS * sizeof(struct Record)));

    char cmd[32], key[64];
    while (scanf("%31s", cmd) == 1) {
        if (strcmp(cmd, "quit") == 0) {
            printf("Bye\n");
            break;
        } else if (strcmp(cmd, "set") == 0) {
            int value;
            if (scanf("%63s %d", key, &value) != 2) {
                printf("Usage: set <key> <value>\n");
                scanf("%*[^\n]");
                continue;
            }
            if (strlen(key) > 15) {
                printf("Keys have at most 15 characters\n");
                continue;
            }
            int checked;
            int at = find(key, &checked);
            struct Record r;
            if (at >= 0) {
                read_slot(at, &r);
                printf("%s = %d (slot %d, was %d)\n", key, value, at, r.value);
                r.value = value;
                write_slot(at, &r);
                continue;
            }
            int i = hash(key), free_slot = -1;
            for (int k = 0; k < SLOTS; k++, i = (i + 1) % SLOTS) {
                read_slot(i, &r);
                if (r.state != USED) {
                    free_slot = i;
                    break;
                }
            }
            if (free_slot < 0) {
                printf("Store full\n");
                continue;
            }
            memset(&r, 0, sizeof r);
            strcpy(r.key, key);
            r.value = value;
            r.state = USED;
            write_slot(free_slot, &r);
            printf("%s = %d (slot %d)\n", key, value, free_slot);
        } else if (strcmp(cmd, "get") == 0 || strcmp(cmd, "del") == 0) {
            scanf("%63s", key);
            int checked;
            int at = find(key, &checked);
            if (at < 0) {
                printf("%s not found (%d %s checked)\n", key, checked, checked == 1 ? "slot" : "slots");
                continue;
            }
            struct Record r;
            read_slot(at, &r);
            if (cmd[0] == 'g') {
                printf("%s = %d (%d %s checked)\n", key, r.value, checked, checked == 1 ? "slot" : "slots");
            } else {
                r.state = DELETED;
                write_slot(at, &r);
                printf("%s deleted from slot %d\n", key, at);
            }
        } else if (strcmp(cmd, "dump") == 0) {
            struct Record r;
            int any = 0;
            for (int i = 0; i < SLOTS; i++) {
                read_slot(i, &r);
                if (r.state == USED) {
                    printf("slot %3d: %s = %d\n", i, r.key, r.value);
                    any = 1;
                } else if (r.state == DELETED) {
                    printf("slot %3d: (deleted)\n", i);
                    any = 1;
                }
            }
            if (!any) printf("The store is empty\n");
        } else if (strcmp(cmd, "stats") == 0) {
            struct Record r;
            int used = 0, deleted = 0;
            for (int i = 0; i < SLOTS; i++) {
                read_slot(i, &r);
                used += r.state == USED;
                deleted += r.state == DELETED;
            }
            fseek(db, 0, SEEK_END);
            printf("%d keys, %d deleted, %d empty, file %ld bytes\n", used, deleted, SLOTS - used - deleted, ftell(db));
        } else {
            printf("Unknown command: %s\n", cmd);
            scanf("%*[^\n]");
        }
    }
    fclose(db);
    return 0;
}
```
