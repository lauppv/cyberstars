Înainte să schimbi proprietarul unui fișier, trebuie să știi **cine ești** în sistem. Două comenzi îți spun asta:

### `whoami`: numele tău de utilizator

```bash
whoami
```

```text
student
```

Simplu și direct: afișează doar numele tău de login.

### `id`: detaliile complete ale identității

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

## Misiune: Verificarea Identității

În directorul tău personal a apărut un document clasificat. Protocolul stației: notezi cine ești înainte să-l atingi, apoi îl securizezi.

1. Scrie jurnalul `verificare-id/identitate.txt`: numele tău de utilizator singur pe prima linie, apoi identitatea ta completă cu grupurile.
2. Fă `clasificat.doc` să poată fi citit și scris doar de proprietar, fără niciun acces pentru altcineva.

**Rezultat așteptat**

`verificare-id/identitate.txt` începe cu numele tău de utilizator și continuă cu id-urile tale de utilizator și de grup, iar doar tu poți deschide `clasificat.doc`.
