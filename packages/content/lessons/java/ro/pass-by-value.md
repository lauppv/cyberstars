Când dai o variabilă unei metode, ce primește metoda: variabila însăși sau o copie? Java are o singură regulă simplă, dar îi surprinde pe aproape toți prima dată. Java dă mereu o **copie a valorii**

---

La un tip primitiv ca `int`, copia e chiar numărul. Dacă îl schimbi în metodă, variabila celui care a apelat rămâne neatinsă

```java
public class Main {
    static void adaugaBonus(int bani) {
        bani = bani + 100;
        System.out.println("Inauntru: " + bani);
    }

    public static void main(String[] args) {
        int bani = 50;
        adaugaBonus(bani);
        System.out.println("Afara: " + bani);
    }
}
```

Ieșire

```text
Inauntru: 150
Afara: 50
```

Metoda și-a primit propriul `bani`, o copie a lui 50. Și-a schimbat copia. `bani` din main nu s-a clintit

---

La un obiect, variabila nu ține obiectul. Ține o **referință**: o adresă care spune unde stă obiectul. Metoda primește o copie a acestei adrese. Ambele adrese duc la același obiect, așa că metoda poate schimba obiectul

```java
class Portofel {
    int bani;
}

public class Main {
    static void adaugaBonus(Portofel p) {
        p.bani = p.bani + 100;
    }

    public static void main(String[] args) {
        Portofel tommy = new Portofel();
        tommy.bani = 50;
        adaugaBonus(tommy);
        System.out.println(tommy.bani);
    }
}
```

Ieșire

```text
150
```

Array-urile merg la fel. O metodă care schimbă `array[0]` schimbă array-ul celui care a apelat, fiindcă îl împart

---

Dar metoda are doar o copie a adresei. Dacă își îndreaptă copia spre un obiect nou, cel care a apelat nu vede asta

```java
class Portofel {
    int bani;
}

public class Main {
    static void schimbaPortofel(Portofel p) {
        p = new Portofel();
        p.bani = 9999;
    }

    public static void main(String[] args) {
        Portofel tommy = new Portofel();
        tommy.bani = 50;
        schimbaPortofel(tommy);
        System.out.println(tommy.bani);
    }
}
```

Ieșire

```text
50
```

`p = new Portofel()` schimbă spre ce arată copia metodei. Variabila lui Tommy arată tot spre portofelul lui vechi, cu 50 în el

---

Pe scurt:

- o metodă nu poate schimba variabilele `int`, `double`, `boolean`, `char` ale celui care a apelat
- o metodă poate schimba ce e într-un obiect sau într-un array pe care îl primește
- o metodă nu poate face variabila celui care a apelat să arate spre alt obiect. Dacă vrea să dea o valoare nouă înapoi, folosește `return`

String-urile sunt obiecte, dar nu se pot schimba deloc, așa că o metodă nu poate schimba niciodată String-ul celui care a apelat

---

## Misiune: Două feluri de mărire

Tommy îi dă o mărire bandei și vrea să vadă care fel de a o scrie chiar merge. Scrie o clasă `Membru` cu un `String nume` și un `int salariu`.

Scrie două metode lângă `main`:

* `maresteSalariu(int salariu, int suma)` adună suma la parametrul ei `salariu` și nu dă nimic înapoi
* `maresteMembru(Membru m, int suma)` adună suma la salariul membrului

În `main`, stochează numele membrului într-un `String` numit `nume`, salariul într-un `int` numit `salariu` și mărirea într-un `int` numit `suma`. Creează membrul, apoi:

1. Apelează `maresteSalariu` cu variabila `salariu` și afișează `Dupa maresteSalariu: <salariu>`
2. Apelează `maresteMembru` cu membrul și afișează `Dupa maresteMembru: <nume> castiga <salariul membrului>`

**Exemplu** pentru `nume = "Lance"`, `salariu = 500` și `suma = 100`

```text
Dupa maresteSalariu: 500
Dupa maresteMembru: Lance castiga 600
```

**Exemplu** pentru `nume = "Ken"`, `salariu = 0` și `suma = 75`

```text
Dupa maresteSalariu: 0
Dupa maresteMembru: Ken castiga 75
```
