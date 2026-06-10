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
uid=1000(student) gid=1000(crew) groups=1000(crew),27(sudo)
```

Afișează **ID-ul de utilizator** (uid), **grupul principal** (gid) și toate grupurile din care faci parte. Grupurile determină ce permisiuni de „group" se aplică pentru tine.

### Proprietatea în `ls -l`

```bash
ls -l mission.txt
```

```text
-rw-r--r-- 1 student crew 512 Jan 10 08:00 mission.txt
```

Cele două nume de după numărul de legături sunt **proprietarul** (`student`) și **grupul** (`crew`). Coloana proprietarului determină pentru cine se aplică permisiunile de „user".

### De ce contează

Dacă nu ești proprietarul unui fișier și nu faci parte din grupul lui, ți se aplică permisiunile de „others". Cunoașterea propriei identități te ajută să prezici ce poți și ce nu poți face.

---

## Misiune: Verificarea identității

Un document clasificat a fost găsit în directorul tău home. Înainte ca cineva să-l poată accesa, protocolul stației cere să-ți verifici identitatea și să confirmi proprietatea fișierului.

1. Rulează `whoami` pentru a-ți confirma numele de utilizator.
2. Rulează `id` pentru a-ți vedea identitatea completă, inclusiv grupurile.
3. Rulează `ls -l classified.doc` pentru a verifica cine deține fișierul.

**Rezultat așteptat**

Vezi numele tău de utilizator (`student`), uid/gid/grupurile tale, și că `classified.doc` este deținut de `student` în grupul `crew`.
