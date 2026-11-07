`grep` caută text _în interiorul_ fișierelor. Dar uneori cauți **fișierul în sine**:
„unde am pus fișierul ăla numit `raport.txt`?”. Pentru asta există **find**.

`find` parcurge un arbore de directoare și listează fișierele care se potrivesc cu
descrierea ta.

Forma de bază este: `find UNDE-SĂ-CAUT CONDIȚII`.

### Căutare după nume: `-name`

Cea mai folosită condiție este `-name`, care potrivește fișierele după nume:

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

## Misiune: Găsește și Pune la Adăpost Fișierul Secret

Serviciul de informații spune că un document secret numit `secret.txt` e păstrat undeva sub directorul tău personal, dar nimeni nu-și mai amintește unde.

1. Află unde e, căutându-l după nume.
2. Tot atunci, listează fiecare fișier `.txt` din arbore cu o singură căutare.
3. Pune fișierul secret la adăpost: copiază-l într-un folder nou `copie-seif` ca `secret-backup.txt`.

**Rezultat așteptat**

Știi calea lui `secret.txt`, vezi fiecare fișier `.txt`, iar `copie-seif/secret-backup.txt` spune ce spune fișierul secret.
