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

Când vrei doar totalul, fără să listezi fiecare fișier, folosește `-s`
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

## Misiune: Auditul Spațiului de Stocare

Inginerii bănuiesc că `depozit` mănâncă din rezervele de disc ale stației. Înainte să aprobe următoarea arhivă, uită-te cât spațiu mai au sistemele de fișiere ale stației, apoi păstrează o singură linie în `audit/raport-stocare.txt`: mărimea totală a lui `depozit`, cu tot ce e în el, în unități pe care un om le citește dintr-o privire.

**Rezultat așteptat**

`audit/raport-stocare.txt` ține o singură linie: o mărime ca `12K` urmată de `depozit`.
