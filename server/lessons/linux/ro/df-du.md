Orice stație are spațiu de stocare limitat. Două comenzi te ajută să monitorizezi
spațiul pe disc:

**`df`** (disk free) arată cât spațiu disponibil este pe fiecare sistem de
fișiere montat. Adaugă `-h` pentru dimensiuni în format ușor de citit:

```bash
df -h
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   32G   18G  64% /
tmpfs           2.0G     0  2.0G   0% /tmp
```

**`du`** (disk usage) arată cât spațiu ocupă un director sau un fișier:

```bash
du -h jurnale/
```

```text
4.0K    jurnale/acces.log
12K     jurnale/eroare.log
16K     jurnale/
```

### Sumarizează un director

Când vrei doar **totalul**, fără să listezi fiecare fișier, folosește `-s`
(summary):

```bash
du -sh jurnale/
```

```text
16K     jurnale/
```

Împreună: `df -h` răspunde la „cât de plin este discul?”, iar `du -sh FOLDER`
răspunde la „cât de mare este folderul ăsta?”.

---

## Misiune: Audit de stocare

Inginerii stației suspectează că `depozit/` mănâncă din rezervele limitate de
disc. Înainte să aprobe următoarea arhivă de date, vor un raport depus la dosar
atât despre situația generală a discului, cât și despre amprenta folderului.

1. Afișează cât spațiu este liber pe sistemele de fișiere ale stației.
2. Măsoară dimensiunea totală a directorului `depozit/` și salvează acea măsurătoare
   într-un fișier numit `raport-stocare.txt`.
3. Creează un folder numit `audit` și mută `raport-stocare.txt` în el.
4. Afișează raportul salvat pentru a-l confirma.

**Rezultat așteptat**

`audit/raport-stocare.txt` conține dimensiunea în format ușor de citit a
directorului `depozit/`.
