Fiecare fișier deschis are o **poziție**, numită și offset: locul unde va avea loc următorul read sau write. Pornește de la 0, primul byte. Fiecare read și fiecare write o mută înainte cu câți bytes au folosit. De aceea citirea într-o buclă trece prin tot fișierul, bucată cu bucată

**lseek** ne lasă să mutăm noi poziția, oriunde în fișier

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("litere.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    write(fd, "ABCDEFGHIJ", 10);

    char c;
    lseek(fd, 3, SEEK_SET);
    read(fd, &c, 1);
    write(1, &c, 1);

    lseek(fd, -1, SEEK_END);
    read(fd, &c, 1);
    write(1, &c, 1);
    write(1, "\n", 1);

    close(fd);
    return 0;
}
```

Ieșire

```text
DJ
```

`lseek(fd, offset, de_unde)` mută poziția. Al treilea argument spune de unde numărăm

- `SEEK_SET` de la începutul fișierului
- `SEEK_CUR` de unde suntem acum
- `SEEK_END` de la finalul fișierului, deci -1 e ultimul byte

Întoarce poziția nouă, numărată de la început

---

Valoarea întoarsă ne dă o cale rapidă de a afla mărimea unui fișier: sărim la final și vedem unde suntem

```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char text[] = "bobina 7, fata A\n";
    int fd = open("banda.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, text, strlen(text));

    off_t marime = lseek(fd, 0, SEEK_END);
    printf("%ld bytes\n", (long)marime);
    close(fd);
    return 0;
}
```

Ieșire

```text
17 bytes
```

off_t e tipul pentru poziții într-un fișier. E un număr întreg mare, așa că îl afișăm cu %ld, după un cast la long

---

Unde strălucește cu adevărat lseek? În fișierele făcute din **înregistrări** (records) care au toate aceeași mărime. Dacă fiecare înregistrare are 16 bytes, înregistrarea cu numărul i începe la byte-ul i × 16. Putem sări direct la ea, fără să citim tot ce e înainte. Asta se numește **acces direct** (random access) și așa găsesc bazele de date un rând repede

```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#define MARIME 8

int main(void) {
    int fd = open("echipaj.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    char nume[3][MARIME] = { "ada", "alan", "grace" };
    for (int i = 0; i < 3; i++) {
        write(fd, nume[i], MARIME);
    }

    char rec[MARIME];
    lseek(fd, 2 * MARIME, SEEK_SET);
    read(fd, rec, MARIME);
    printf("inregistrarea 2: %s\n", rec);

    char nou[MARIME] = "linus";
    lseek(fd, 1 * MARIME, SEEK_SET);
    write(fd, nou, MARIME);

    lseek(fd, 1 * MARIME, SEEK_SET);
    read(fd, rec, MARIME);
    printf("inregistrarea 1: %s\n", rec);

    printf("marime: %ld\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
```

Ieșire

```text
inregistrarea 2: grace
inregistrarea 1: linus
marime: 24
```

Fiecare nume stă într-un loc de 8 bytes, cu `'\0'` umplând restul, deci o înregistrare citită înapoi e un șir gata făcut. Deschis cu O_RDWR, același fișier poate fi citit și scris, iar scrierea peste înregistrarea 1 schimbă doar acei 8 bytes

---

## Misiune: Tamburul cu înregistrări

Centrul își ține lista echipajului pe un tambur, ca înregistrări de exact 16 bytes: un nume, cu `'\0'` umplând restul locului. Operatorii cer o înregistrare după numărul ei sau scriu un nume nou peste unul vechi

1. Citește un număr întreg n, apoi n nume. Scrie-le, în ordine, ca înregistrări de 16 bytes în fișierul `drum.dat`, făcut întâi nou și gol
2. Apoi citește comenzi până se termină datele
   - `get i`: sari la înregistrarea i cu lseek, citește-o și afișează numele. Dacă nu există înregistrarea i, afișează `Nu exista ` și i
   - `set i nume`: sari la înregistrarea i și scrie numele nou peste ea. Dacă nu există înregistrarea i, afișează `Nu exista ` și i
3. La final, afișează mărimea fișierului, aflată cu lseek, ca în exemplu

Înregistrările sunt numerotate de la 0. Numele sunt un cuvânt de cel mult 15 litere. n e între 1 și 100, iar i între 0 și 999

**Exemplu**

Intrare

```text
3
ada
grace
ken
get 1
set 1 linus
get 1
get 5
```

Ieșire

```text
grace
linus
Nu exista 5
Marime: 48 bytes
```
