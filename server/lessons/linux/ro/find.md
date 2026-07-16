`grep` caută text _în interiorul_ fișierelor. Dar uneori cauți **fișierul în sine**
— „unde am pus fișierul ăla numit `raport.txt`?”. Pentru asta există **find**.

`find` parcurge un arbore de directoare și listează fișierele care se potrivesc cu
descrierea ta.

Forma de bază este: `find UNDE-SĂ-CAUT CONDIȚII`.

### Căutare după nume: `-name`

Cea mai folosită condiție este `-name` — potrivește fișierele după nume:

```bash
find . -name raport.txt
```

```text
./documente/raport.txt
./arhiva/vechi/raport.txt
```

`.` înseamnă „pornește de aici”. `find` caută în acel folder **și în fiecare
sub-folder din el**, apoi afișează calea fiecărei potriviri.

### Caractere joker

Simbolul `*` se potrivește cu „orice caractere”. Pune tiparul între ghilimele ca
shell-ul să nu îl extindă mai întâi:

```bash
find . -name "*.log"
```

Astfel găsești fiecare fișier care se termină în `.log`, oriunde în arbore.

### Unde să cauți

Poți să-i indici lui `find` orice folder, nu doar `.`:

```bash
find jurnale -name "eroare.txt"
```

`find` este unealta ta pentru „știu numele, nu și locația”.

---

## Misiune: Localizează și pune la adăpost fișierul clasificat

Serviciul de informații raportează că un document clasificat numit `secret.txt`
este stocat undeva în arborele directorului tău personal, dar nimeni nu mai
ține minte calea exactă. Odată găsit, trebuie pus la adăpost.

1. Caută în tot arborele fișierul numit `secret.txt` și afișează-i calea completă.
2. Caută din nou în arbore fiecare fișier care se termină în `.log`, folosind un
   caracter joker.
3. Acum că știi unde se află, creează un folder numit `copie-seif` și copiază fișierul
   clasificat `date/seif/secret.txt` în el sub numele `secret-backup.txt`.

**Rezultat așteptat**

Apare calea către `secret.txt`, apoi fișierele `.log`, iar folderul `copie-seif`
conține un backup pus la adăpost al fișierului clasificat.
