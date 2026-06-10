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
du -h logs/
```

```text
4.0K    logs/access.log
12K     logs/error.log
16K     logs/
```

### Sumarizează un director

Când vrei doar **totalul**, fără să listezi fiecare fișier, folosește `-s`
(summary):

```bash
du -sh logs/
```

```text
16K     logs/
```

Împreună: `df -h` răspunde la „cât de plin este discul?”, iar `du -sh FOLDER`
răspunde la „cât de mare este folderul ăsta?”.

---

## Misiune: Audit de stocare

Inginerii stației suspectează că `cargo-bay/` mănâncă din rezervele limitate de
disc. Înainte să aprobe următoarea arhivă de date, trebuie să știe exact cât
spațiu ocupă directorul.

Rulează `du -sh cargo-bay/` pentru a afișa dimensiunea totală a directorului.

**Rezultat așteptat**

O singură linie care arată dimensiunea în format ușor de citit a directorului
`cargo-bay/`.
