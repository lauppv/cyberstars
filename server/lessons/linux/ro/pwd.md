De fiecare dată când folosești terminalul, te afli **înăuntrul unui folder** — Linux
îi spune **director** (directory). Acesta este _locația ta curentă_, cunoscută și ca
**directorul de lucru** (working directory).

Este important să știi unde te afli: comenzi precum „listează fișierele de aici" sau
„șterge acest fișier" acționează asupra directorului tău curent.

Pentru a afla unde ești, folosește **pwd** — vine de la **print working directory**.

```bash
pwd
```

Afișează calea completă a folderului în care te afli, de exemplu:

```text
/home/student
```

Această cale se citește ca un drum: începe cu `/` (**rădăcina** întregului sistem),
iar fiecare `/` separă un folder de următorul. Astfel, `/home/student` înseamnă:

- `/` — rădăcina
- `home` — un folder din interiorul rădăcinii
- `student` — un folder din interiorul lui home (acesta este folderul _tău_)

Când pornești terminalul, începi de obicei în **directorul tău personal** (home
directory) — locul care îți aparține. Pentru utilizatorul `student`, acest director
este `/home/student`.

`pwd` nu modifică nimic. El doar _raportează_ — îl poți rula oricât de des dorești,
fără niciun risc.

---

## Misiune: Localizează-ți Poziția

Tocmai ai ajuns la stație și ai deschis un terminal nou. Înainte de orice altceva, trebuie să confirmi poziția ta în sistemul de fișiere.

Rulează `pwd` pentru a afla în ce director te găsești în acest moment.

**Rezultat așteptat**

Terminalul afișează calea ta absolută, arătând că te afli în `/home/student`.
