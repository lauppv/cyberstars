Capitolul 7 te-a învățat stratul de securitate al sistemului de fișiere al stației:

| Comandă     | Scop                                         |
| ----------- | -------------------------------------------- |
| `ls -l`     | Vezi permisiunile și proprietarul            |
| `chmod u+x` | Adaugă/elimină permisiuni (simbolic)         |
| `chmod 755` | Setează toate permisiunile deodată (numeric) |
| `whoami`    | Afișează numele tău de utilizator            |
| `id`        | Afișează uid, gid și grupurile               |

Reține triada de permisiuni: **user → group → others**, fiecare cu `r`, `w`, `x`.
Numeric: r=4, w=2, x=1. Adună-le pe grup.

---

## Misiune: Protocol de Izolare

A fost detectată o breșă de securitate pe puntea 3, iar căpitanul a ordonat izolarea fiecărui fișier din directorul tău personal. Protocolul împarte fișierele în patru feluri:

- **Secret**: doar proprietarul îl citește și îl scrie; nimeni altcineva nu primește nimic.
- **Script**: proprietarul poate face orice, grupul îl poate citi și rula, ceilalți nimic.
- **Intern**: proprietarul îl citește și îl scrie, grupul îl poate citi, ceilalți nimic.
- **Public**: toată lumea îl poate citi, doar proprietarul îl poate scrie.

Uită-te la fiecare fișier, hotărăște de ce fel e și dă-i accesul acela.

**Rezultat așteptat**

Fiecare fișier din directorul tău personal are exact accesul felului său.
