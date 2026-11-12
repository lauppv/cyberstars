Felicitări, cadet. Ai învățat navigare, gestionarea fișierelor, căutare,
pipeline-uri, procesare de text, permisiuni și unelte de sistem. Acum este
momentul să te dovedești.

Directorul Centru de Comandă al stației este o harababură. Un ofițer anterior
a lăsat fișiere împrăștiate prin foldere greșite, permisiuni stricate și niciun
raport de sinteză. Ofițerul tău comandant are nevoie ca directorul să fie
organizat și un raport final generat înainte să înceapă următorul schimb.

---

## Misiune: Reorganizarea Centrului de Comandă

Un ofițer din tura anterioară a lăsat Centrul de Comandă în haos: totul aruncat în `intrari/`, nimic sortat, setările de securitate deschise oricui și niciun raport pentru comandă. Căpitanul vrea totul reparat înainte de următoarea rotație a echipajului. Nimeni nu-ți spune cum; ai uneltele.

Ordinele căpitanului:

- Jurnalele stau în `jurnale/`, iar fișierele de configurare în `config/`. Notițele personale ale ofițerului rămân în `intrari/`, singure.
- `rapoarte/probleme-critice.txt`: fiecare linie `CRITICAL` din toate jurnalele, fiecare cu jurnalul din care vine.
- `rapoarte/config-sortat.txt`: fiecare setare din toate fișierele de configurare, într-o singură listă alfabetică.
- `config/securitate.conf` ține datele de acces: doar proprietarul lui îl poate citi sau modifica, iar nimeni altcineva nu primește nimic.
- `rapoarte/rezumat-misiune.txt`: data și ora curentă pe prima linie, `Stare: complet` pe a doua.

Tot ce e în rapoarte vine direct din fișiere și din sistem, nu scris de mână, în afară de linia de stare.

**Rezultat așteptat**

`intrari/` ține doar notițele, fiecare jurnal și fișier de configurare e în folderul lui, `securitate.conf` e închis pentru oricine în afară de proprietar, iar cele trei rapoarte spun ce a cerut căpitanul. Stația contează pe tine, cadet.
