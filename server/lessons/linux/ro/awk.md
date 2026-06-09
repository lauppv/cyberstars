**awk** este un limbaj puternic de procesare de text integrat în Linux. În forma sa
cea mai simplă, împarte fiecare linie în câmpuri și te lasă să afișezi pe cele
dorite.

Implicit, awk împarte după spațiul alb. Câmpurile sunt numerotate `$1`, `$2`, `$3`,
etc. `$0` este întreaga linie.

```bash
awk '{print $1}' crew.txt
```

Aceasta afișează doar primul cuvânt din fiecare linie.

### Afișarea mai multor câmpuri

```bash
awk '{print $1, $3}' data.txt
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
awk '{print "Name:", $1}' crew.txt
```

```text
Name: Voss
Name: Tanaka
```

Poți combina liber șiruri literale și variabile de câmp în interiorul instrucțiunii
print.

---

## Misiune: Extragere date senzori

Inginerii au cerut o citire rapidă a numelor sectoarelor și a valorilor lor de la senzori — nu au nevoie de coloana cu tipul citirii care încarcă afișajul.

Folosește `awk` ca să afișezi **doar coloanele 1 și 3** din `sensors.dat` (sectorul și valoarea).

**Rezultat așteptat**

Fiecare linie arată un nume de sector urmat de valoarea sa numerică, separate printr-un spațiu.
