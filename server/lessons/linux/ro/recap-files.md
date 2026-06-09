Capitolul 2 ți-a oferit întreg setul de unelte pentru gestionarea fișierelor. E
timpul să le folosești pe toate într-o singură construcție.

| Comandă              | Rol                              |
| -------------------- | -------------------------------- |
| `mkdir` (`-p`)       | creează foldere                  |
| `touch`              | creează fișiere goale            |
| `cp` (`-r`)          | copiază fișiere și foldere       |
| `mv`                 | mută și redenumește              |
| `rm` (`-r`), `rmdir` | șterge fișiere și foldere        |

Un folder de proiect începe aproape întotdeauna la fel: creezi directoarele, apoi pui
fișierele în ele. Planifică structura mai întâi, apoi construiește-o pas cu pas.
Folosește `ls` și `tree` între pași pentru a-ți verifica munca.

---

## Misiune: Schela unei noi misiuni

O nouă misiune de explorare în spațiu îndepărtat a fost aprobată și are nevoie de un director de proiect bine organizat înainte ca echipa științifică să poată începe să încarce datele. De asemenea, trebuie să faci curățenie după reziduurile lăsate de ofițerul din tura anterioară.

1. Creează un folder numit `project`.
2. În interiorul lui, creează două subfoldere printr-o singură comandă: `mkdir -p project/src project/docs`.
3. În `project/src`, creează un fișier gol numit `main.sh`.
4. Copiază fișierul existent `template.txt` în `project/docs/readme.txt`.
5. Șterge fișierul rezidual `junk.txt` din directorul tău home.

**Rezultat așteptat**

Rulând `ls project/src` apare `main.sh`. Rulând `cat project/docs/readme.txt` apare textul template-ului. Fișierul `junk.txt` nu mai există în directorul tău home.
