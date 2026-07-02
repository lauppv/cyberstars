Cum **vorbesc** procesele între ele? Unul dintre cele mai simple mecanisme este un **pipe**. Dacă ai folosit Linux, ai văzut deja pipe-uri:

```text
ls | grep ".txt"
```

Simbolul **|** ia output-ul lui **ls** și îl trimite ca input lui **grep**. Acela este un pipe

---

Un pipe este un **canal de comunicare unidirecțional**. Un proces **scrie** în el, alt proces **citește** din el. Gândește-te la el ca la o țeavă de apă — apa curge într-o singură direcție

În C, creăm un pipe cu funcția **pipe()**

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    // fd[0] = capatul de citire
    // fd[1] = capatul de scriere

    pid_t pid = fork();

    if (pid == 0) {
        // COPIL: scrie in pipe
        close(fd[0]);   // inchide capatul de citire (copilul doar scrie)
        char mesaj[] = "Salut de la copil!";
        write(fd[1], mesaj, strlen(mesaj) + 1);
        close(fd[1]);
    } else {
        // PARINTE: citeste din pipe
        close(fd[1]);   // inchide capatul de scriere (parintele doar citeste)
        char buf[100];
        read(fd[0], buf, sizeof(buf));
        printf("Parintele a primit: %s\n", buf);
        close(fd[0]);
        wait(NULL);
    }

    return 0;
}
```

Output: **Parintele a primit: Salut de la copil!**

---

Hai să descompunem:

1. **pipe(fd)** creează doi file descriptori: **fd[0]** pentru citire, **fd[1]** pentru scriere
2. Facem **fork** — acum atât părintele cât și copilul au copii ale pipe-ului
3. **Copilul** închide capătul de citire (are nevoie doar să scrie), scrie un mesaj și închide capătul de scriere
4. **Părintele** închide capătul de scriere (are nevoie doar să citească), citește mesajul și închide capătul de citire

De ce închidem capetele pe care nu le folosim? E ca închiderea unei uși de care nu ai nevoie. Dacă părintele nu închide capătul de scriere, citirea **nu va ști niciodată** când a terminat copilul de scris — va aștepta la nesfârșit

---

**File descriptorii** sunt o idee mare. În Unix, **totul este un fișier**. Tastatura ta este file descriptor 0 (**stdin**). Ecranul tău este file descriptor 1 (**stdout**). Mesajele de eroare merg la file descriptor 2 (**stderr**). Un pipe creează doi file descriptori noi

Când scrii **printf("salut")**, merge la fd 1 (stdout → ecranul tău). Când folosești **scanf**, citește de la fd 0 (stdin → tastatura ta). Pipe-urile conectează stdout-ul unui proces la stdin-ul altuia. Asta este literalmente tot ce face simbolul **|** într-un terminal

---

Pipe-urile sunt blocul fundamental de construcție pentru comunicarea între procese în Unix. Shell-urile le folosesc, serverele web le folosesc, chiar și Docker le folosește intern. Filozofia este simplă: programe mici care fac un singur lucru bine, conectate prin pipe-uri

---

## Misiune: Mesajul prin teleimprimantă

Două procese trebuie să comunice printr-un pipe, exact cum ar trece un mesaj de la o teleimprimantă la alta printr-o linie dedicată.

1. Creează un pipe și fă fork
2. **Copilul** scrie mesajul **"Bell Labs"** în pipe, apoi închide capetele sale
3. **Părintele** citește mesajul și afișează **"Primit: Bell Labs"**, apoi închide capetele sale și așteaptă copilul

**Exemplu**

Programul tău ar trebui să afișeze

```text
Primit: Bell Labs
```

Nu uita să închizi capetele de pipe pe care nu le folosești
