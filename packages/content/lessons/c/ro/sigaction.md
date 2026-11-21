signal() e ușor de folosit, dar e vechi și se poartă puțin diferit pe sisteme diferite. Programele adevărate folosesc **sigaction**. Face aceeași treabă, cu mai mult control și la fel peste tot

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t sonerii = 0;

void la_sonerie(int sig) {
    (void)sig;
    sonerii++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_sonerie;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    sigaction(SIGUSR1, &sa, NULL);

    raise(SIGUSR1);
    printf("sonerii: %d\n", sonerii);
    return 0;
}
```

Ieșire

```text
sonerii: 1
```

Completăm un `struct sigaction` și îl predăm

- `sa_handler`: funcția noastră, sau SIG_IGN, sau SIG_DFL
- `sa_mask`: alte semnale ținute pe loc cât rulează handler-ul nostru. sigemptyset o face o mulțime goală
- `sa_flags`: opțiuni. **SA_RESTART** spune: dacă semnalul a întrerupt un apel de sistem lent, ca read care așteaptă date, pornește din nou acel apel în loc să-l faci să eșueze

Ultimul argument poate primi setarea veche, dacă vrem s-o punem înapoi mai târziu. NULL înseamnă că nu ne interesează

---

Uneori un program are o parte care nu trebuie întreruptă, de exemplu când schimbă mai multe valori care merg împreună. Poate **bloca** un semnal o vreme. Un semnal blocat nu se pierde: kernelul îl marchează ca **în așteptare** (pending) și îl livrează imediat ce e deblocat

Blocăm și deblocăm cu **sigprocmask**, folosind o mulțime de semnale

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t sonerii = 0;

void la_sonerie(int sig) {
    (void)sig;
    sonerii++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = la_sonerie;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGUSR1, &sa, NULL);

    sigset_t multime;
    sigemptyset(&multime);
    sigaddset(&multime, SIGUSR1);

    sigprocmask(SIG_BLOCK, &multime, NULL);
    raise(SIGUSR1);
    raise(SIGUSR1);
    raise(SIGUSR1);
    printf("cat e blocat: %d\n", sonerii);

    sigprocmask(SIG_UNBLOCK, &multime, NULL);
    printf("dupa deblocare: %d\n", sonerii);
    return 0;
}
```

Ieșire

```text
cat e blocat: 0
dupa deblocare: 1
```

---

Uită-te atent: trei sonerii, dar un singur apel al handler-ului. Un semnal nu e o coadă. „În așteptare” e un da sau nu, un singur bit pentru fiecare semnal. Cât e blocat, a doua și a treia sonerie găsesc bitul deja pus și nu schimbă nimic. Așa că un semnal ne poate spune „asta s-a întâmplat cel puțin o dată”, niciodată „asta s-a întâmplat de 3 ori”

Ca să întrebăm dacă un semnal așteaptă, **sigpending** umple o mulțime cu semnalele în așteptare, iar **sigismember** verifică unul dintre ele

```c
#include <stdio.h>
#include <signal.h>

int main(void) {
    sigset_t multime;
    sigemptyset(&multime);
    sigaddset(&multime, SIGUSR1);
    sigprocmask(SIG_BLOCK, &multime, NULL);
    raise(SIGUSR1);

    sigset_t asteapta;
    sigpending(&asteapta);
    if (sigismember(&asteapta, SIGUSR1)) {
        printf("SIGUSR1 e in asteptare\n");
    }
    return 0;
}
```

Ieșire

```text
SIGUSR1 e in asteptare
```

---

## Misiune: Soneria

Soneria sălii mașinilor e legată la SIGUSR1. Când tehnicienii sunt ocupați, o blochează și vor doar să știe dacă a sunat cineva. Arată cum funcționează asta

1. Instalează cu sigaction un handler pentru SIGUSR1. Doar numără soneriile pe care le aude
2. Citește cuvinte până se termină datele
   - `ring`: trimite-ți SIGUSR1 cu raise
   - `block`: blochează SIGUSR1 cu sigprocmask
   - `unblock`: deblochează-l
   - `check`: afișează câte sonerii au fost auzite până acum și dacă o sonerie e în așteptare, ca în exemplu
3. La final, deblochează SIGUSR1 dacă e încă blocat și afișează `Auzite: ` și numărul final

Sunt cel mult 100 de cuvinte

**Exemplu**

Intrare

```text
ring check block ring ring check unblock check
```

Ieșire

```text
auzite 1, in asteptare nu
auzite 1, in asteptare da
auzite 2, in asteptare nu
Auzite: 2
```
