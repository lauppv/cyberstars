Poți să creezi și să muți fișiere — dar cum vezi _ce se află înăuntrul_ unuia? Cea
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

`cat` este perfect pentru fișiere **scurte** — câteva linii pe care vrei să le citești
dintr-o privire. Pentru fișiere foarte lungi inundă ecranul; vei întâlni curând unelte
mai potrivite (`head`, `tail`, `less`) pentru astfel de situații.

### Afișarea mai multor fișiere

Dă-i lui `cat` mai multe fișiere și le va afișa unul după altul, lipite împreună:

```bash
cat parte1.txt parte2.txt
```

Această „lipire” este motivul pentru care comanda se numește _concatenate_.

La fel ca `ls` și `pwd`, `cat` doar citește — nu modifică niciodată fișierul.

---

## Misiune: Citește și arhivează briefing-ul

Un nou briefing a sosit împărțit în două fișiere din directorul tău home: ordinul
principal în `instructaj.txt` și o `anexa.txt` cu detalii de ultim moment. Citește-le,
apoi pune deoparte o copie a instructajului principal pentru arhivă.

1. Afișează `instructaj.txt` ca să vezi ordinul principal.
2. Afișează **ambele** fișiere lipite împreună într-o singură comandă, ca să ai
   briefing-ul complet dintr-o privire.
3. Creează un folder numit `arhiva` și copiază `instructaj.txt` în el sub numele
   `instructaj-vechi.txt`.
4. Confirmă arhiva afișând conținutul lui `arhiva/instructaj-vechi.txt`.

**Rezultat așteptat**

Ambele briefing-uri apar în terminal. Folderul `arhiva` conține o copie fidelă a
instructajului, iar afișarea ei arată exact același text ca originalul.
