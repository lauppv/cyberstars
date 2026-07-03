Felicitări, cadet. Ai învățat navigare, gestionarea fișierelor, căutare,
pipeline-uri, procesare de text, permisiuni și unelte de sistem. Acum este
momentul să te dovedești.

Directorul **Centru de Comandă** al stației este o harababură. Un ofițer anterior
a lăsat fișiere împrăștiate prin foldere greșite, permisiuni stricate și niciun
raport de sinteză. Ofițerul tău comandant are nevoie ca directorul să fie
organizat și un raport final generat **înainte să înceapă următorul schimb**.

---

## Misiune: Reorganizarea centrului de comandă

Un ofițer din schimbul anterior a lăsat Centrul de Comandă în haos — fișiere noi
aruncate în `intrari/`, nimic sortat, permisiuni larg deschise și niciun raport
de stare pentru comandă. Căpitanul vrea asta reparat înainte de următoarea
rotație de echipaj. Ai uneltele. Du treaba la capăt.

1. **Sortează intrările.** Mută toate fișierele `.log` din `intrari/` în
   `jurnale/`. Mută toate fișierele `.conf` din `intrari/` în `config/`.

2. **Caută problemele critice.** Folosește `grep -r` pentru a căuta în întreg
   directorul `jurnale/` cuvântul `CRITICAL`. Redirecționează liniile găsite în
   `rapoarte/probleme-critice.txt`.

3. **Construiește un manifest de configurare.** Folosește `cat` pentru a
   combina toate fișierele `.conf` din `config/` și trimite prin pipe către
   `sort`, salvând rezultatul în `rapoarte/config-sortat.txt`.

4. **Blochează securitatea.** Fișierul `config/securitate.conf` conține
   credențiale sensibile de acces. Setează permisiunile astfel încât doar
   proprietarul să le poată citi și scrie — fără acces pentru grup sau ceilalți.
   Folosește `chmod 600`.

5. **Depune raportul final.** Creează `rapoarte/rezumat-misiune.txt` care
   conține data curentă pe prima linie (folosește `date >`) și textul
   `Stare: complet` pe a doua linie (folosește `echo >>` pentru a adăuga).

6. **Verifică-ți munca.** Rulează `ls rapoarte/` pentru a confirma că toate cele
   trei fișiere de raport sunt la locul lor.

**Rezultat așteptat**

`intrari/` ar trebui să conțină doar `notite-vechi.txt`. Directorul `jurnale/`
găzduiește cele trei fișiere `.log`, `config/` găzduiește cele trei fișiere
`.conf` (cu `securitate.conf` blocat la `600`), iar `rapoarte/` conține
`probleme-critice.txt`, `config-sortat.txt` și `rezumat-misiune.txt`. Stația
contează pe tine, cadet.
