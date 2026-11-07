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

E util când vrei să știi dacă o comandă este sau nu instalată: dacă `which` nu
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

## Misiune: Sonda pentru Date Necunoscute

O scanare de rutină a găsit `mister.dat` în directorul tău personal. Nimeni nu știe ce ține, iar numele lui nu spune nimic.

1. Înainte să ai încredere în unelte, află unde e instalat programul care numără liniile.
2. Află ce fel de date ține de fapt `mister.dat`, fără să-l deschizi.
3. Dacă se dovedește că se poate citi, citește-l.
4. Arhivează-l sub un nume care are sens: o copie într-un folder nou `identificat` ca `readme.txt`.

**Rezultat așteptat**

Vezi unde stă numărătorul de linii, ce fel de fișier e `mister.dat` și mesajul lui, iar `identificat/readme.txt` e o copie a lui.
