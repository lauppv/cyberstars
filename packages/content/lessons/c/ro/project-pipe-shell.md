Proiectul Mini Shell rula câte o comandă. Acum știi destul ca să construiești unul adevărat: pipeline-uri, redirecționare din și în fișiere, coduri de ieșire și comenzi care schimbă chiar shell-ul. Proiectul folosește toată partea de sisteme de operare a cursului: fork, exec, wait, pipe, dup2, open și errno

Aici nu e cod de copiat, doar un plan. Construiește-l pas cu pas și testează fiecare pas înainte de următorul

---

**Pasul 1: o comandă.** Citește o linie, împarte-o în cuvinte cu strtok, fork, execvp în copil, waitpid în părinte. Păstrează codul de ieșire al ultimei comenzi

**Pasul 2: comenzi interne.** Unele comenzi nu pot fi programe separate, pentru că trebuie să schimbe chiar shell-ul. Un copil care apelează chdir își schimbă doar propriul folder, apoi se termină, iar shell-ul rămâne unde era. Așa că shell-ul le rulează singur, fără fork

- `cd dir`: apelează **chdir**, din unistd.h. Când eșuează, afișează motivul
- `status`: afișează codul de ieșire al ultimei comenzi, ca `$?` într-un shell adevărat
- `exit`: oprește shell-ul

**Pasul 3: redirecționarea.** Înainte de exec, copilul deschide fișierul și îl mută pe 0 sau pe 1 cu dup2, ca în lecția despre dup2. `>` face fișierul nou și gol, `>>` adaugă la finalul lui cu O_APPEND

**Pasul 4: pipeline-uri.** Împarte cuvintele în etape la fiecare `|`. Cu k etape îți trebuie k - 1 pipe-uri. Etapa i citește din pipe-ul i - 1 și scrie în pipe-ul i. Ține minte marea regulă din lecția despre pipeline: fiecare proces închide fiecare capăt de pipe pe care nu-l folosește, iar părintele le închide pe toate. Apoi așteaptă toate etapele. Codul de ieșire e al ultimei etape

---

O cale bună de a ține totul în ordine e să transformi întâi o linie în etape și abia apoi să le rulezi

```c
#include <stdio.h>

struct etapa {
    char *argumente[16];
    char *in;
    char *out;
    int adauga;
};

int main(void) {
    // sort -r < nume.txt >> sortat.txt
    struct etapa s = { { "sort", "-r", NULL }, "nume.txt", "sortat.txt", 1 };
    printf("rulez: %s %s\n", s.argumente[0], s.argumente[1]);
    printf("in: %s, out: %s, adauga: %d\n", s.in, s.out, s.adauga);
    return 0;
}
```

Ieșire

```text
rulez: sort -r
in: nume.txt, out: sortat.txt, adauga: 1
```

in și out rămân NULL când nu există redirecționare

---

## Misiune: Shell-ul cu pipe-uri

1. Citește linii până se termină datele sau până la `exit`. Sari peste liniile goale. Cuvintele sunt despărțite prin câte un spațiu, iar `|`, `<`, `>`, `>>` sunt mereu cuvinte separate
2. Comenzi interne, mereu singure pe linia lor
   - `cd dir`: schimbă folderul shell-ului. Dacă eșuează, afișează `cd: `, folderul, `: ` și motivul dat de strerror și pune codul pe 1. Altfel codul e 0
   - `status`: afișează ultimul cod
   - `exit`: oprește-te
3. Orice altă linie e un pipeline de 1 până la 4 comenzi, despărțite prin `|`
   - `< fisier` poate apărea doar la prima comandă, `> fisier` sau `>> fisier` doar la ultima
   - Dacă fișierul de intrare nu poate fi deschis, afișează numele fișierului, `: ` și motivul, pune codul pe 1 și nu rula nimic
   - Dacă exec eșuează, copilul afișează numele și `: comanda nu exista` în **stderr** și iese cu 127
   - Codul e codul de ieșire al ultimei comenzi
4. Apelează fflush(stdout) înainte de fiecare fork

Comenzile nu citesc niciodată date decât dacă vin din `<` sau dintr-un pipe. Liniile au cel mult 200 de caractere. La început, codul e 0

**Exemplu**

Intrare

```text
echo hello tape room | tr a-z A-Z
seq 5 > nums.txt
sort -rn < nums.txt | head -n 2
seq 3 >> nums.txt
wc -l < nums.txt
nosuchcmd
status
cd nowhere
status
```

Ieșire

```text
HELLO TAPE ROOM
5
4
8
127
cd: nowhere: No such file or directory
1
```

nosuchcmd își scrie eroarea în stderr, deci nu face parte din ieșire. Testele verifică doar ce merge în stdout
