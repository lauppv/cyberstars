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

## Misiune: Extragerea Datelor de la Senzori

Ingineria vrea o citire rapidă din `senzori.dat`: fiecare sector cu valoarea lui, fără coloana care spune ce fel de citire e. Salvează-o ca `jurnal-senzori/citire.txt`, sectorul și valoarea despărțite de un spațiu, cea mai mică valoare întâi.

**Rezultat așteptat**

`jurnal-senzori/citire.txt` ține două coloane, sectorul și valoarea, ordonate de la cea mai mică valoare la cea mai mare.
