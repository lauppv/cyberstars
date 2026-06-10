Felicitări, cadet. Ai învățat navigare, gestionarea fișierelor, căutare,
pipeline-uri, procesare de text, permisiuni și unelte de sistem. Acum este
momentul să te dovedești.

Directorul **Mission Control** al stației este o harababură. Un ofițer anterior
a lăsat fișiere împrăștiate prin foldere greșite, permisiuni stricate și niciun
raport de sinteză. Ofițerul tău comandant are nevoie ca directorul să fie
organizat și un raport final generat **înainte să înceapă următorul schimb**.

---

## Misiune: Reorganizarea centrului de comandă

Un ofițer din schimbul anterior a lăsat directorul Mission Control în haos —
fișiere noi aruncate în `inbox/`, nimic sortat, permisiuni larg deschise și
niciun raport de stare pentru comandă. Căpitanul vrea asta reparat înainte de
următoarea rotație de echipaj. Ai uneltele. Du treaba la capăt.

1. **Sortează inbox-ul.** Mută toate fișierele `.log` din `inbox/` în `logs/`.
   Mută toate fișierele `.conf` din `inbox/` în `config/`.

2. **Caută problemele critice.** Folosește `grep -r` pentru a căuta în întreg
   directorul `logs/` cuvântul `CRITICAL`. Redirecționează liniile găsite în
   `reports/critical-issues.txt`.

3. **Construiește un manifest de configurare.** Folosește `cat` pentru a
   combina toate fișierele `.conf` din `config/` și trimite prin pipe către
   `sort`, salvând rezultatul în `reports/sorted-config.txt`.

4. **Blochează securitatea.** Fișierul `config/security.conf` conține
   credențiale sensibile de acces. Setează permisiunile astfel încât doar
   proprietarul să le poată citi și scrie — fără acces pentru grup sau ceilalți.
   Folosește `chmod 600`.

5. **Depune raportul final.** Creează `reports/mission-summary.txt` care
   conține data curentă pe prima linie (folosește `date >`) și textul
   `STATUS: COMPLETE` pe a doua linie (folosește `echo >>` pentru a adăuga).

6. **Verifică-ți munca.** Rulează `ls reports/` pentru a confirma că toate cele
   trei fișiere de raport sunt la locul lor.

**Rezultat așteptat**

`inbox/` ar trebui să conțină doar `old-notes.txt`. Directorul `logs/` găzduiește
cele trei fișiere `.log`, `config/` găzduiește cele trei fișiere `.conf` (cu
`security.conf` blocat la `600`), iar `reports/` conține `critical-issues.txt`,
`sorted-config.txt` și `mission-summary.txt`. Stația contează pe tine, cadet.
