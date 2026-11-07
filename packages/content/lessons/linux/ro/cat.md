Poți să creezi și să muți fișiere, dar cum vezi _ce se află înăuntrul_ unuia? Cea
mai simplă unealtă este **cat**.

Numele vine prescurtat de la **concatenate**, dar utilizarea de zi cu zi este simplă:
**afișează conținutul unui fișier pe ecran**.

```bash
cat misiune.txt
```

```text
Misiune: exploreaza sectorul 7.
Stare: in desfasurare.
```

Tot fișierul este aruncat în terminal dintr-odată.

### Când să folosești cat

`cat` este perfect pentru fișiere **scurte**: câteva linii pe care vrei să le citești
dintr-o privire. Pentru fișiere foarte lungi inundă ecranul; vei întâlni curând unelte
mai potrivite (`head`, `tail`, `less`) pentru astfel de situații.

### Afișarea mai multor fișiere

Dă-i lui `cat` mai multe fișiere și le va afișa unul după altul, lipite împreună:

```bash
cat parte1.txt parte2.txt
```

Această „lipire” este motivul pentru care comanda se numește _concatenate_.

La fel ca `ls` și `pwd`, `cat` doar citește. Nu modifică niciodată fișierul.

---

## Misiune: Citește și Arhivează Instructajul

A sosit un instructaj nou în două părți: ordinul principal în `instructaj.txt` și detaliile de ultim moment în `anexa.txt`. Citește tot instructajul ca un singur text, ambele părți într-o singură comandă, apoi păstrează ordinul principal pentru registru ca `arhiva/instructaj-vechi.txt`.

**Rezultat așteptat**

Ai citit ambele părți una după alta, iar copia arhivată spune exact ce spune ordinul principal.
