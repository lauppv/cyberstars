Te poți deplasa prin stație — acum este momentul să **construiești**. Prima cărămidă
de construcție este un nou **director** (folder).

Comanda **mkdir** (**make directory**) creează un folder. Dă-i numele pe care îl
dorești:

```bash
mkdir reports
```

Nimic nu este afișat când reușește — Linux tace când totul merge bine. Rulează `ls`
pentru a confirma că folderul a apărut:

```bash
ls
```

```text
reports
```

### Crearea mai multor foldere simultan

`mkdir` acceptă mai multe nume:

```bash
mkdir logs data backups
```

Astfel creezi trei foldere dintr-o singură comandă.

### Foldere imbricate: `mkdir -p`

Ce faci dacă vrei un folder _în interiorul_ unui alt folder care nu există încă?
Asta eșuează:

```bash
mkdir projects/website
```

```text
mkdir: cannot create directory 'projects/website': No such file or directory
```

Opțiunea `-p` (**parents**) îi spune lui `mkdir` să creeze fiecare folder lipsă de pe
parcurs:

```bash
mkdir -p projects/website
```

Acum există atât `projects`, cât și `projects/website`.

---

## Misiune: Construiește un spațiu de lucru

Stația are nevoie de o nouă structură de directoare pentru misiunea care urmează. O vei configura de la zero.

1. Creează un folder numit `mission`.
2. Folosind o singură comandă `mkdir -p`, creează calea imbricată `mission/logs/day1`.

**Rezultat așteptat**

Directorul `mission/logs/day1` există. Poți verifica cu `ls mission/logs` pentru a vedea `day1` înăuntru.
