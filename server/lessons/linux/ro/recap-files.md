Capitolul 2 ți-a oferit întreg setul de unelte pentru gestionarea fișierelor. E
timpul să le folosești pe toate într-o singură construcție.

| Comandă              | Rol                        |
| -------------------- | -------------------------- |
| `mkdir` (`-p`)       | creează foldere            |
| `touch`              | creează fișiere goale      |
| `cp` (`-r`)          | copiază fișiere și foldere |
| `mv`                 | mută și redenumește        |
| `rm` (`-r`), `rmdir` | șterge fișiere și foldere  |

Un folder de proiect începe aproape întotdeauna la fel: creezi directoarele, apoi pui
fișierele în ele. Planifică structura mai întâi, apoi construiește-o pas cu pas.
Folosește `ls` și `tree` între pași pentru a-ți verifica munca.

---

## Misiune: Schela unei noi misiuni

O nouă misiune de explorare în spațiu îndepărtat a fost aprobată și are nevoie de un director de proiect bine organizat înainte ca echipa științifică să poată începe să încarce datele. De asemenea, trebuie să faci curățenie după reziduurile lăsate de ofițerul din tura anterioară.

1. Creează un folder numit `proiect`.
2. În interiorul lui, creează două subfoldere printr-o singură comandă: `mkdir -p proiect/sursa proiect/documente`.
3. În `proiect/sursa`, creează un fișier gol numit `principal.sh`.
4. Copiază fișierul existent `sablon.txt` în `proiect/documente/citeste-ma.txt`.
5. Șterge fișierul rezidual `gunoi.txt` din directorul tău home.

**Rezultat așteptat**

Rulând `ls proiect/sursa` apare `principal.sh`. Rulând `cat proiect/documente/citeste-ma.txt` apare textul șablonului. Fișierul `gunoi.txt` nu mai există în directorul tău home.
