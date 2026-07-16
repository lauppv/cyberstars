**awk** este un limbaj puternic de procesare de text integrat în Linux. În forma sa
cea mai simplă, împarte fiecare linie în câmpuri și te lasă să afișezi pe cele
dorite.

Implicit, awk împarte după spațiul alb. Câmpurile sunt numerotate `$1`, `$2`, `$3`,
etc. `$0` este întreaga linie.

```bash
awk '{print $1}' echipaj.txt
```

Aceasta afișează doar primul cuvânt din fiecare linie.

### Afișarea mai multor câmpuri

```bash
awk '{print $1, $3}' date.txt
```

Virgula inserează un spațiu între câmpuri în output.

### Separator de câmp personalizat cu `-F`

Dacă datele tale folosesc un alt delimitator (cum ar fi două puncte), spune-i lui
awk:

```bash
awk -F: '{print $2}' /etc/passwd
```

Aceasta împarte după `:` și afișează al doilea câmp.

### Adăugarea de text

```bash
awk '{print "Nume:", $1}' echipaj.txt
```

```text
Nume: Voss
Nume: Tanaka
```

Poți combina liber șiruri literale și variabile de câmp în interiorul instrucțiunii
print.

---

## Misiune: Extragere date senzori

Inginerii au cerut o citire rapidă a numelor sectoarelor și a valorilor lor de la senzori — nu au nevoie de coloana cu tipul citirii care încarcă afișajul.

1. Folosește `awk` ca să afișezi **doar coloanele 1 și 3** din `senzori.dat` (sectorul și valoarea), și afișează-le.
2. Salvează acel extras cu două coloane într-un fișier nou numit `citire.txt`.
3. Creează un folder numit `jurnal-senzori` și mută `citire.txt` în el.
4. Sortează citirea salvată numeric, după a doua coloană, astfel încât cea mai mică valoare a senzorului să apară prima.

**Rezultat așteptat**

`jurnal-senzori/citire.txt` conține fiecare nume de sector urmat de valoarea sa numerică, separate printr-un spațiu.
