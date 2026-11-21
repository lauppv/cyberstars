Următorul proiect: un sistem de rezervări pentru un avion mic de pe Escobar International, aeroportul din Vice City. Oamenii cer un anumit loc sau orice loc. Sistemul dă locurile, refuză cererile greșite și ține o listă de așteptare când avionul e plin

Vei folosi un array 2D, char-uri, propria excepție, o coadă și un StringBuilder. Câte un pas o dată

---

**Pasul 1: Harta locurilor**

Un avion are rânduri, iar fiecare rând are același număr de locuri. Asta e o grilă, așa că folosim un array 2D. Fiecare celulă ține numele pasagerului, sau `null` când locul e liber

```text
class Avion {
    String[][] locuri;

    Avion(int randuri, int locuriPeRand) {
        locuri = new String[randuri][locuriPeRand];
    }
}
```

Un array nou de String-uri e plin de `null`, așa că un avion nou pornește gol

---

**Pasul 2: De la codul locului la grilă**

Pasagerii vorbesc în coduri de loc ca `3B`: numărul rândului, apoi o literă. Grila vorbește în indecși care încep de la 0. Deci `3B` e rândul cu indexul 2 și locul cu indexul 1

```java
public class Main {
    public static void main(String[] args) {
        String cod = "12C";

        int rand = Integer.parseInt(cod.substring(0, cod.length() - 1)) - 1;
        int coloana = cod.charAt(cod.length() - 1) - 'A';
        System.out.println(rand + " " + coloana);

        String inapoi = (rand + 1) + "" + (char) ('A' + coloana);
        System.out.println(inapoi);
    }
}
```

Ieșire

```text
11 2
12C
```

Ultimul caracter e litera, tot ce e înainte e numărul. `'C' - 'A'` e 2, pentru că în spate char-urile sunt numere. Ca să te întorci, adună indexul la `'A'` și transformă-l într-un `char`

---

**Pasul 3: O excepție pentru locuri greșite**

Un loc poate fi greșit în două feluri: nu există în avionul ăsta sau îl are deja cineva

```text
class LocException extends Exception {
    LocException(String mesaj) {
        super(mesaj);
    }
}
```

---

**Pasul 4: Rezervarea unui loc ales**

Transformă codul în indecși, verifică-i, apoi ia locul

```text
void rezerva(String nume, String cod) throws LocException {
    int rand = Integer.parseInt(cod.substring(0, cod.length() - 1)) - 1;
    int coloana = cod.charAt(cod.length() - 1) - 'A';
    if (rand < 0 || rand >= locuri.length || coloana < 0 || coloana >= locuri[0].length) {
        throw new LocException("Nu există locul " + cod);
    }
    if (locuri[rand][coloana] != null) {
        throw new LocException("Locul " + cod + " e ocupat");
    }
    locuri[rand][coloana] = nume;
}
```

Verifică întâi că locul există, înainte să te uiți în el. În ordinea cealaltă, `locuri[rand][coloana]` ar opri programul cu un index în afara limitelor

---

**Pasul 5: Orice loc liber, sau lista de așteptare**

Unora nu le pasă unde stau. Parcurge grila rând cu rând, loc cu loc, și dă-le primul loc liber. Dacă nu e niciunul, intră într-o coadă: primul care așteaptă e primul care primește mai târziu un loc

```text
Queue<String> asteptare = new LinkedList<>();

String rezervaOricare(String nume) {
    for (int r = 0; r < locuri.length; r++) {
        for (int c = 0; c < locuri[r].length; c++) {
            if (locuri[r][c] == null) {
                locuri[r][c] = nume;
                return (r + 1) + "" + (char) ('A' + c);
            }
        }
    }
    asteptare.offer(nume);
    return null;
}
```

`return` din interiorul buclelor oprește căutarea la primul loc liber. Dacă buclele se termină fără `return`, avionul e plin

---

**Pasul 6: Afișarea hărții**

Pentru echipaj, afișează câte un rând pentru fiecare rând de locuri: numărul rândului, un spațiu, apoi `X` pentru un loc ocupat și `.` pentru unul liber. Un StringBuilder construiește fiecare rând

```java
public class Main {
    public static void main(String[] args) {
        String[][] locuri = new String[2][3];
        locuri[0][1] = "Tommy";
        locuri[1][0] = "Lance";

        for (int r = 0; r < locuri.length; r++) {
            StringBuilder linie = new StringBuilder();
            linie.append(r + 1).append(" ");
            for (String l : locuri[r]) {
                linie.append(l == null ? "." : "X");
            }
            System.out.println(linie);
        }
    }
}
```

Ieșire

```text
1 .X.
2 X..
```

---

## Misiune: Escobar International

Construiește avionul din pașii de mai sus, apoi trece prin el rezervările zilei

Avionul are `int randuri` rânduri și `int locuriPeRand` locuri pe fiecare rând (cel mult 6, deci literele merg de la A la F). Rezervările sunt într-un array `String[] rezervari`. Fiecare e `nume:loc`, de exemplu `Tommy:1A`, sau `nume:oricare`. Fă o `LocException` care extinde `Exception` și ține locurile într-un array 2D. Pentru fiecare rezervare, afișează:

- `nume primește loc` când merge, cu locul primit
- `Refuzat: Nu există locul cod` când locul nu e în avion și `Refuzat: Locul cod e ocupat` când îl are cineva
- `nume așteaptă un loc` când a cerut orice loc și avionul e plin

La final afișează harta, câte un rând pentru fiecare rând de locuri, ca la pasul 6, apoi `Așteaptă: ` și numele de pe lista de așteptare în ordine, despărțite de o virgulă și un spațiu, sau `Așteaptă: nimeni`

**Exemplu**

```text
Tommy primește 1A
Refuzat: Locul 1A e ocupat
Lance primește 1B
Refuzat: Nu există locul 3A
Kent primește 2B
Phil primește 2A
Candy așteaptă un loc
Diaz așteaptă un loc
1 XX
2 XX
Așteaptă: Candy, Diaz
```

**Exemplu**

```text
1 ...
Așteaptă: nimeni
```
