```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

void esec(const char *comanda, const char *nume) {
    printf("%s %s: %s\n", comanda, nume, strerror(errno));
}

int scrie_cuvant(const char *nume, const char *cuvant, int flaguri) {
    int fd = open(nume, flaguri, 0644);
    if (fd == -1) {
        return -1;
    }
    write(fd, cuvant, strlen(cuvant));
    write(fd, "\n", 1);
    close(fd);
    return 0;
}

int arata(const char *nume) {
    char buf[4096];
    int fd = open(nume, O_RDONLY);
    if (fd == -1) {
        return -1;
    }
    ssize_t total = 0;
    ssize_t n;
    while ((n = read(fd, buf + total, sizeof(buf) - 1 - total)) > 0) {
        total = total + n;
    }
    close(fd);
    buf[total] = '\0';
    printf("%s", buf);
    return 0;
}

int copiaza(const char *din, const char *in_fisier) {
    int intrare = open(din, O_RDONLY);
    if (intrare == -1) {
        return -1;
    }
    int out = open(in_fisier, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) {
        close(intrare);
        return -1;
    }
    char buf[512];
    ssize_t n;
    while ((n = read(intrare, buf, sizeof(buf))) > 0) {
        write(out, buf, n);
    }
    close(intrare);
    close(out);
    return 0;
}

int se_termina_cu_txt(const char *nume) {
    size_t lungime = strlen(nume);
    return lungime >= 4 && strcmp(nume + lungime - 4, ".txt") == 0;
}

int dupa_nume(const void *a, const void *b) {
    return strcmp(a, b);
}

void listeaza(void) {
    char nume[256][256];
    int numar = 0;
    DIR *dir = opendir(".");
    struct dirent *intrare_dir;
    while ((intrare_dir = readdir(dir)) != NULL) {
        if (se_termina_cu_txt(intrare_dir->d_name) && numar < 256) {
            strcpy(nume[numar], intrare_dir->d_name);
            numar++;
        }
    }
    closedir(dir);
    qsort(nume, numar, sizeof(nume[0]), dupa_nume);
    for (int i = 0; i < numar; i++) {
        struct stat st;
        stat(nume[i], &st);
        printf("%s %ld\n", nume[i], (long)st.st_size);
    }
    printf("Fisiere: %d\n", numar);
}

int main(void) {
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        char comanda[16];
        char a[64];
        char b[64];
        int gasite = sscanf(linie, "%15s %63s %63s", comanda, a, b);
        if (gasite < 1) {
            continue;
        }

        if (strcmp(comanda, "list") == 0) {
            listeaza();
        } else if (strcmp(comanda, "write") == 0 && gasite == 3) {
            if (scrie_cuvant(a, b, O_WRONLY | O_CREAT | O_TRUNC) == -1) {
                esec(comanda, a);
            }
        } else if (strcmp(comanda, "append") == 0 && gasite == 3) {
            if (scrie_cuvant(a, b, O_WRONLY | O_APPEND) == -1) {
                esec(comanda, a);
            }
        } else if (strcmp(comanda, "copy") == 0 && gasite == 3) {
            if (copiaza(a, b) == -1) {
                esec(comanda, a);
            }
        } else if (strcmp(comanda, "show") == 0 && gasite >= 2) {
            if (arata(a) == -1) {
                esec(comanda, a);
            }
        } else if (strcmp(comanda, "remove") == 0 && gasite >= 2) {
            if (unlink(a) == -1) {
                esec(comanda, a);
            }
        }
    }
    return 0;
}
```
