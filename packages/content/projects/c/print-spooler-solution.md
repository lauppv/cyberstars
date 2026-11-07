```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXP 10
#define MAXU 50

struct Job {
    int id;
    char user[32];
    int pages;
    int urgent;
    int done;
    int submitted;
    struct Job *next;
};

struct Printer {
    char name[32];
    int ppm;
    struct Job *job;
    int jammed;
    int printed;
};

struct Printer pr[MAXP];
int np;
struct Job *queue = NULL;
int next_id = 1, minute = 0;
char users[MAXU][32];
int user_pages[MAXU], nu = 0;
int finished = 0, total_wait = 0;

void add_pages(const char *user, int pages) {
    for (int i = 0; i < nu; i++)
        if (strcmp(users[i], user) == 0) {
            user_pages[i] += pages;
            return;
        }
    strcpy(users[nu], user);
    user_pages[nu++] = pages;
}

/* urgent jobs before normal ones, each kind in the order submitted; `front` puts a job back first in its kind */
void enqueue(struct Job *j, int front) {
    struct Job **p = &queue;
    while (*p && ((*p)->urgent > j->urgent || ((*p)->urgent == j->urgent && !front && (*p)->id < j->id)))
        p = &(*p)->next;
    j->next = *p;
    *p = j;
}

int queued(void) {
    int n = 0;
    for (struct Job *j = queue; j; j = j->next) n++;
    return n;
}

int main(void) {
    scanf("%d", &np);
    for (int i = 0; i < np; i++) {
        scanf("%31s %d", pr[i].name, &pr[i].ppm);
        pr[i].job = NULL;
        pr[i].jammed = pr[i].printed = 0;
    }
    printf("%d printers ready\n", np);
    char cmd[32];
    while (scanf("%31s", cmd) == 1) {
        if (strcmp(cmd, "quit") == 0) {
            printf("Spooler stopped\n");
            break;
        } else if (strcmp(cmd, "submit") == 0) {
            char user[32], kind[16];
            int pages;
            if (scanf("%31s %d %15s", user, &pages, kind) != 3 || pages < 1 ||
                (strcmp(kind, "normal") != 0 && strcmp(kind, "urgent") != 0)) {
                printf("Usage: submit <user> <pages> <normal|urgent>\n");
                scanf("%*[^\n]");
                continue;
            }
            struct Job *j = malloc(sizeof *j);
            j->id = next_id++;
            strcpy(j->user, user);
            j->pages = pages;
            j->urgent = strcmp(kind, "urgent") == 0;
            j->done = 0;
            j->submitted = minute;
            enqueue(j, 0);
            printf("Job %d: %d pages for %s, %d in the queue\n", j->id, pages, user, queued());
        } else if (strcmp(cmd, "queue") == 0) {
            for (int i = 0; i < np; i++) {
                printf("%s: ", pr[i].name);
                if (pr[i].jammed) printf("jammed\n");
                else if (pr[i].job) printf("job %d, %d of %d pages\n", pr[i].job->id, pr[i].job->done, pr[i].job->pages);
                else printf("free\n");
            }
            if (!queue) printf("Queue empty\n");
            for (struct Job *j = queue; j; j = j->next)
                printf("Job %d: %s, %d pages%s\n", j->id, j->user, j->pages, j->urgent ? ", urgent" : "");
        } else if (strcmp(cmd, "tick") == 0) {
            int k;
            if (scanf("%d", &k) != 1 || k < 1) {
                printf("Usage: tick <minutes>\n");
                scanf("%*[^\n]");
                continue;
            }
            for (int t = 0; t < k; t++) {
                minute++;
                for (int i = 0; i < np; i++) {
                    if (pr[i].jammed) continue;
                    if (!pr[i].job && queue) {
                        pr[i].job = queue;
                        queue = queue->next;
                        printf("Minute %d: %s starts job %d (%s)\n", minute, pr[i].name, pr[i].job->id, pr[i].job->user);
                    }
                    struct Job *j = pr[i].job;
                    if (!j) continue;
                    int n = pr[i].ppm;
                    if (n > j->pages - j->done) n = j->pages - j->done;
                    j->done += n;
                    pr[i].printed += n;
                    add_pages(j->user, n);
                    if (j->done == j->pages) {
                        printf("Minute %d: %s finished job %d (%s)\n", minute, pr[i].name, j->id, j->user);
                        finished++;
                        total_wait += minute - j->submitted;
                        free(j);
                        pr[i].job = NULL;
                    }
                }
            }
        } else if (strcmp(cmd, "cancel") == 0) {
            int id;
            if (scanf("%d", &id) != 1) {
                printf("Usage: cancel <job>\n");
                scanf("%*[^\n]");
                continue;
            }
            int found = 0;
            for (struct Job **p = &queue; *p; p = &(*p)->next)
                if ((*p)->id == id) {
                    struct Job *j = *p;
                    *p = j->next;
                    free(j);
                    printf("Job %d cancelled\n", id);
                    found = 1;
                    break;
                }
            for (int i = 0; i < np && !found; i++)
                if (pr[i].job && pr[i].job->id == id) {
                    printf("Job %d cancelled after %d of %d pages\n", id, pr[i].job->done, pr[i].job->pages);
                    free(pr[i].job);
                    pr[i].job = NULL;
                    found = 1;
                }
            if (!found) printf("No job %d\n", id);
        } else if (strcmp(cmd, "jam") == 0 || strcmp(cmd, "fixed") == 0) {
            char name[32];
            scanf("%31s", name);
            int i = 0;
            while (i < np && strcmp(pr[i].name, name) != 0) i++;
            if (i == np) printf("No printer %s\n", name);
            else if (cmd[0] == 'j') {
                pr[i].jammed = 1;
                printf("%s jammed", name);
                if (pr[i].job) {
                    printf(", job %d goes back to the queue", pr[i].job->id);
                    pr[i].job->done = 0;
                    enqueue(pr[i].job, 1);
                    pr[i].job = NULL;
                }
                printf("\n");
            } else {
                pr[i].jammed = 0;
                printf("%s works again\n", name);
            }
        } else if (strcmp(cmd, "report") == 0) {
            printf("Minutes: %d\n", minute);
            for (int i = 0; i < np; i++) printf("%s: %d pages\n", pr[i].name, pr[i].printed);
            /* users sorted by name: a small selection of the next one each time */
            int shown[MAXU] = {0};
            for (int k = 0; k < nu; k++) {
                int best = -1;
                for (int i = 0; i < nu; i++)
                    if (!shown[i] && (best < 0 || strcmp(users[i], users[best]) < 0)) best = i;
                shown[best] = 1;
                printf("%s: %d pages\n", users[best], user_pages[best]);
            }
            if (finished) printf("Average time to print: %.1f min\n", (double)total_wait / finished);
            else printf("Average time to print: none\n");
            printf("Still waiting: %d\n", queued());
        } else {
            printf("Unknown command: %s\n", cmd);
            scanf("%*[^\n]");
        }
    }
    for (int i = 0; i < np; i++) free(pr[i].job);
    while (queue) {
        struct Job *j = queue;
        queue = queue->next;
        free(j);
    }
    return 0;
}
```
