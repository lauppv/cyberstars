Cum creează sistemul de operare procese noi? În Unix/Linux, există un apel de sistem fascinant: **fork()**. **Clonează** procesul curent, creând o copie exactă

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("Inainte de fork\n");

    pid_t pid = fork();

    if (pid == 0) {
        printf("Sunt COPILUL, PID-ul meu: %d\n", getpid());
    } else {
        printf("Sunt PARINTELE, PID-ul copilului: %d\n", pid);
        wait(NULL);
    }

    printf("Gata\n");
    return 0;
}
```

După **fork()**, sunt **două procese** care rulează același cod. Originalul este **părintele**, copia este **copilul**. Cum știu care e care? **fork()** returnează:

- **0** către procesul copil
- **PID-ul copilului** către procesul părinte

De asta verificăm **pid == 0** — este singurul mod de a-ți da seama care suntem

---

Gândește-te la asta ca la diviziunea celulară în biologie. O celulă se împarte în două celule identice. Ambele au același ADN (cod), dar apoi pot merge în direcții diferite. **if/else**-ul de după fork este modul în care trimitem părintele și copilul pe căi diferite

**wait(NULL)** face părintele să **se oprească** până când copilul termină. Fără el, părintele ar putea termina primul și lucrurile devin dezordonate. E ca un părinte care așteaptă la poarta școlii — nu pleca fără copilul tău

---

Mesajul "Inainte de fork" se afișează **o dată** (înainte de despărțire). Mesajul "Gata" se afișează de **două ori** — o dată de la părinte și o dată de la copil. Asta este partea care te face să întorci capul: după fork, ambele procese continuă din **același punct** în cod

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("Inainte de fork\n");     // se afiseaza 1 data

    fork();

    printf("Dupa fork\n");      // se afiseaza de 2 ori!
    return 0;
}
```

Dacă faci fork din nou înăuntrul unuia dintre acele procese, obții 4 procese. Fork este **exponențial**. Ai grijă :)

---

**fork** este fundamentul felului în care funcționează Unix. Când deschizi un terminal și tastezi o comandă, shell-ul **face fork** la sine însuși, iar procesul copil **se înlocuiește** cu noul program (folosind o funcție numită **exec**, pe care nu o vom trata în detaliu dar e bine să știi că există)

Acest pattern fork-apoi-exec este peste tot:

1. Shell-ul face fork → acum sunt 2 shell-uri
2. Shell-ul copil apelează exec("ls") → copilul rulează acum "ls"
3. Shell-ul părinte așteaptă ca copilul să termine
4. "ls" termină, shell-ul părinte afișează prompt-ul din nou

---

## Misiune: Activarea Camerei de Clonare

Camera de Clonare a stației trebuie să producă o clonă-muncitor care să ruleze un diagnostic. Clona își raportează propriul ID, iar operatorul original așteaptă până când clona termină înainte de a înregistra finalizarea.

1. Apelează **fork()** pentru a crea un proces copil
2. **Copilul** afișează **"Copil: salut de la PID X"** (unde X este PID-ul său real din **getpid()**)
3. **Părintele** apelează **wait(NULL)**, apoi afișează **"Parinte: copilul a terminat"**

**Output**

```text
Copil: salut de la PID 12345
Parinte: copilul a terminat
```

PID-ul va varia la fiecare rulare. Folosește **fork()**, **getpid()** și **wait(NULL)** din **unistd.h** și **sys/wait.h**
