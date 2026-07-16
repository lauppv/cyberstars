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
file notite.txt
```

```text
notite.txt: ASCII text
```

```bash
file photo.png
```

```text
photo.png: PNG image data
```

`file` se uită la octeții reali, deci are dreptate chiar și când extensia lipsește
sau este greșită.

| Comandă | Întrebarea la care răspunde           |
| ------- | ------------------------------------- |
| `which` | „Unde este instalat acest _program_?” |
| `file`  | „Ce _tip_ de fișier este acesta?”     |

---

## Misiune: Sondarea datelor necunoscute

O scanare de rutină a găsit un fișier numit `mister.dat` în directorul tău
personal. Extensia este necunoscută și nimeni nu știe ce conține. Investighează-l,
apoi arhivează-l cum se cuvine.

1. Confirmă că unealta de bază pentru listare (`ls`) este chiar instalată pe acest
   sistem.
2. Identifică ce fel de date se află de fapt în `mister.dat`.
3. Se dovedește a fi text simplu, lizibil — afișează-i conținutul ca să vezi
   mesajul.
4. Creează un folder numit `identificat` și copiază fișierul în el sub numele mai
   clar `readme.txt`.

**Rezultat așteptat**

Vezi unde se află `ls`, inspecția dezvăluie că `mister.dat` este text ASCII simplu
în ciuda numelui său suspect, citești mesajul, iar o copie stă în
`identificat/readme.txt` sub un nume care în sfârșit are sens.
