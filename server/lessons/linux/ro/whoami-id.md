Înainte să schimbi proprietarul unui fișier, trebuie să știi **cine ești** în sistem. Două comenzi îți spun asta:

### `whoami` — numele tău de utilizator

```bash
whoami
```

```text
student
```

Simplu și direct — afișează doar numele tău de login.

### `id` — detaliile complete ale identității

```bash
id
```

```text
uid=1000(student) gid=1000(echipaj) groups=1000(echipaj),27(sudo)
```

Afișează **ID-ul de utilizator** (uid), **grupul principal** (gid) și toate grupurile din care faci parte. Grupurile determină ce permisiuni de „group" se aplică pentru tine.

### Proprietatea în `ls -l`

```bash
ls -l misiune.txt
```

```text
-rw-r--r-- 1 student echipaj 512 Jan 10 08:00 misiune.txt
```

Cele două nume de după numărul de legături sunt **proprietarul** (`student`) și **grupul** (`echipaj`). Coloana proprietarului determină pentru cine se aplică permisiunile de „user".

### De ce contează

Dacă nu ești proprietarul unui fișier și nu faci parte din grupul lui, ți se aplică permisiunile de „others". Cunoașterea propriei identități te ajută să prezici ce poți și ce nu poți face.

---

## Misiune: Verificarea identității

Un document clasificat a fost găsit în directorul tău home. Înainte ca cineva să-l poată accesa, protocolul stației cere să-ți înregistrezi identitatea și să blochezi fișierul.

1. Confirmă numele tău de utilizator.
2. Salvează detaliile complete ale identității tale, inclusiv grupurile, într-un fișier numit `identitate.txt`.
3. Blochează `clasificat.doc` astfel încât doar proprietarul să îl poată citi și modifica, iar nimeni altcineva să nu aibă acces.
4. Creează un folder numit `verificare-id` și mută `identitate.txt` în el.

**Rezultat așteptat**

`verificare-id/identitate.txt` conține detaliile identității tale, iar `clasificat.doc` este `-rw-------`.
