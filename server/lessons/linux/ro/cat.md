Poți să creezi și să muți fișiere — dar cum vezi _ce se află înăuntrul_ unuia? Cea
mai simplă unealtă este **cat**.

Numele vine prescurtat de la **concatenate**, dar utilizarea de zi cu zi este simplă:
**afișează conținutul unui fișier pe ecran**.

```bash
cat mission.txt
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
cat part1.txt part2.txt
```

Această „lipire” este motivul pentru care comanda se numește _concatenate_.

La fel ca `ls` și `pwd`, `cat` doar citește — nu modifică niciodată fișierul.

---

## Misiune: Citește briefing-ul

Un nou briefing de misiune a sosit și este stocat în `instructaj.txt` în directorul tău
home. Citește-l pentru a afla care este următorul obiectiv al echipajului.

Folosește `cat` pentru a afișa conținutul fișierului `instructaj.txt`.

**Rezultat așteptat**

Textul complet al briefing-ului apare în terminalul tău.
