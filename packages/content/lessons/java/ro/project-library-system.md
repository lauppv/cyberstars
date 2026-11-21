E timpul pentru un proiect mai mare! Biblioteca publică din Vice City încă își ține cărțile într-un caiet de hârtie, iar lucrurile se pierd. Hai să-i facem bibliotecii un mic sistem: știe fiecare carte, cine o are și spune nu când o cerere nu are sens

Proiectul ăsta folosește multe din ce ai învățat de la ultimele proiecte: un TreeMap, propria excepție, `throw` și `throws`, `split` și `try`/`catch`. Îl construim bucată cu bucată

---

**Pasul 1: Clasa Carte**

O carte are un titlu și numele persoanei care o are. Când cartea e pe raft, n-o are nimeni, așa că numele e `null`

```text
class Carte {
    String titlu;
    String cititor;

    Carte(String titlu) {
        this.titlu = titlu;
    }
}
```

Nu setăm `cititor` în constructor. Un câmp pe care nu-l setezi pornește ca `null`, adică exact „pe raft”

---

**Pasul 2: Clasa Biblioteca**

Biblioteca își ține cărțile într-un `TreeMap<String, Carte>`, cu titlul drept cheie. Vin două lucruri bune cu el: găsim o carte după titlu imediat, iar catalogul e mereu în ordine alfabetică

```text
class Biblioteca {
    TreeMap<String, Carte> raft = new TreeMap<>();

    void adaugaCarte(String titlu) {
        raft.put(titlu, new Carte(titlu));
    }
}
```

---

**Pasul 3: O excepție pentru bibliotecă**

Multe cereri pot merge prost: o carte care nu există, o carte deja împrumutată. Toate sunt același fel de problemă, așa că îi dăm propria excepție

```text
class BibliotecaException extends Exception {
    BibliotecaException(String mesaj) {
        super(mesaj);
    }
}
```

Extinde `Exception`, deci e checked. Fiecare metodă care o aruncă trebuie să spună `throws BibliotecaException`, iar Java se asigură că apelantul se ocupă de ea

---

**Pasul 4: Găsirea unei cărți**

Și împrumutul, și returnarea încep la fel: găsește cartea sau protestează. Așa că asta merge într-o metodă ajutătoare

```text
Carte gaseste(String titlu) throws BibliotecaException {
    Carte carte = raft.get(titlu);
    if (carte == null) {
        throw new BibliotecaException("Nicio carte numită " + titlu);
    }
    return carte;
}
```

`get` dă `null` când cheia nu e în map. Ăsta e semnul că biblioteca nu are cartea

---

**Pasul 5: Împrumut și returnare**

Acum cele două acțiuni. Fiecare verifică întâi starea cărții și aruncă o excepție când cererea nu are sens

```text
void imprumuta(String titlu, String nume) throws BibliotecaException {
    Carte carte = gaseste(titlu);
    if (carte.cititor != null) {
        throw new BibliotecaException(titlu + " e deja împrumutată");
    }
    carte.cititor = nume;
}

void returneaza(String titlu) throws BibliotecaException {
    Carte carte = gaseste(titlu);
    if (carte.cititor == null) {
        throw new BibliotecaException(titlu + " nu era împrumutată");
    }
    carte.cititor = null;
}
```

Observă că și `gaseste` poate arunca. Nu o prindem aici: zboară mai departe la cine a apelat `imprumuta`, iar `throws BibliotecaException` o acoperă

---

**Pasul 6: Citirea cererilor**

Oamenii predau cererile ca rânduri scurte, cu părțile despărțite de `:`

- `imprumuta:Dracula:Lance` înseamnă că Lance vrea să împrumute Dracula
- `returneaza:Dracula` înseamnă că cineva aduce Dracula înapoi

`split(":")` taie o cerere în părți, iar prima parte spune ce e de făcut

```java
public class Main {
    public static void main(String[] args) {
        String cerere = "imprumuta:Moby Dick:Phil";
        String[] parti = cerere.split(":");

        System.out.println(parti[0]);
        System.out.println(parti[1]);
        System.out.println(parti[2]);
    }
}
```

Ieșire

```text
imprumuta
Moby Dick
Phil
```

---

**Pasul 7: Totul la un loc**

Pentru fiecare cerere, apelează metoda potrivită într-un `try`. Dacă merge, afișează ce s-a întâmplat. Dacă biblioteca aruncă, afișează de ce a spus nu

```text
try {
    if (parti[0].equals("imprumuta")) {
        biblioteca.imprumuta(parti[1], parti[2]);
        System.out.println(parti[2] + " a luat " + parti[1]);
    } else {
        biblioteca.returneaza(parti[1]);
        System.out.println(parti[1] + " s-a întors");
    }
} catch (BibliotecaException e) {
    System.out.println("Refuzat: " + e.getMessage());
}
```

O cerere greșită nu le oprește pe celelalte, pentru că `try` e în interiorul buclei

---

## Misiune: Biblioteca din Vice City

Construiește biblioteca din pașii de mai sus, apoi trece prin ea cererile unei zile

Titlurile cărților sunt într-un array `String[] carti`, iar cererile într-un array `String[] cereri`. O cerere e `imprumuta:titlu:nume` sau `returneaza:titlu`. Scrie clasele `Carte`, `Biblioteca` (cu metodele `imprumuta` și `returneaza`) și `BibliotecaException`. Pentru fiecare cerere, afișează:

- `nume a luat titlu` când un împrumut merge
- `titlu s-a întors` când o returnare merge
- `Refuzat: ` și motivul când nu merge. Motivele sunt `Nicio carte numită titlu`, `titlu e deja împrumutată` și `titlu nu era împrumutată`

La final afișează `Catalog:` și apoi fiecare carte în ordine alfabetică, ca `titlu: pe raft` sau `titlu: la nume`

**Exemplu**

```text
Lance a luat Dracula
Refuzat: Dracula e deja împrumutată
Refuzat: Nicio carte numită Scarface
Refuzat: Moby Dick nu era împrumutată
Dracula s-a întors
Phil a luat Dracula
Catalog:
Dracula: la Phil
Insula comorii: pe raft
Moby Dick: pe raft
```

**Exemplu**

```text
Catalog:
Hamlet: pe raft
```
