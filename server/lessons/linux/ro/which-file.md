Două comenzi mici, dar foarte utile, îți completează arsenalul de căutare:
**which** și **file**.

### Unde se află o comandă? `which`

Când scrii `ls`, Linux rulează un program stocat undeva pe disc. Comanda **which**
îți spune _exact unde_ se află acel program:

```bash
which ls
```

```text
/bin/ls
```

```bash
which grep
```

```text
/usr/bin/grep
```

E util când vrei să știi dacă o comandă este sau nu instalată — dacă `which` nu
afișează nimic, comanda nu a fost găsită.

### Ce fel de fișier este acesta? `file`

Numele unui fișier nu îți spune întotdeauna ce se află în el. Comanda **file**
**inspectează conținutul** și raportează tipul:

```bash
file notes.txt
```

```text
notes.txt: ASCII text
```

```bash
file photo.png
```

```text
photo.png: PNG image data
```

`file` se uită la octeții reali, deci are dreptate chiar și când extensia lipsește
sau este greșită.

| Comandă | Întrebarea la care răspunde                |
| ------- | ------------------------------------------ |
| `which` | „Unde este instalat acest _program_?”      |
| `file`  | „Ce _tip_ de fișier este acesta?”          |

---

## Misiune: Sondarea datelor necunoscute

O scanare de rutină a găsit un fișier numit `mystery.dat` în directorul tău
personal. Extensia este necunoscută și nimeni nu știe ce conține. Înainte de a-l
deschide, trebuie să investighezi.

1. Folosește `which ls` pentru a confirma că uneltele de bază sunt disponibile pe
   acest sistem.
2. Folosește `file mystery.dat` pentru a identifica ce fel de date se află de
   fapt înăuntru.

**Rezultat așteptat**

Vezi calea unde este instalat `ls`, iar `file` dezvăluie că `mystery.dat` este
text ASCII simplu, în ciuda numelui său suspect.
