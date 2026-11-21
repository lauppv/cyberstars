`ArrayList<String>` ține String-uri, `ArrayList<Integer>` ține Integer-i, și e aceeași clasă ArrayList. Cum? ArrayList e o **clasă generică**: are un parametru de tip, un loc gol pe care îl completezi cu un tip când o folosești. Poți scrie și tu clase așa

---

Iată o cutie care poate ține un lucru de orice tip. `T` e locul gol

```java
class Cutie<T> {
    T lucru;

    Cutie(T lucru) {
        this.lucru = lucru;
    }

    T ia() {
        return lucru;
    }
}

public class Main {
    public static void main(String[] args) {
        Cutie<String> bilet = new Cutie<>("Ne vedem la Malibu");
        Cutie<Integer> bani = new Cutie<>(5000);

        String text = bilet.ia();
        int suma = bani.ia() + 100;
        System.out.println(text);
        System.out.println(suma);
    }
}
```

Ieșire

```text
Ne vedem la Malibu
5100
```

În clasă, `T` înseamnă „tipul pe care îl va alege cineva”. În `Cutie<String>` fiecare `T` devine `String`, în `Cutie<Integer>` devine `Integer`. `<>` din dreapta îl lasă pe Java să copieze tipul din stânga

---

De ce să nu folosești pur și simplu `Object` pentru lucru? Fiindcă atunci Java uită tipul adevărat. Ai avea nevoie de un cast de fiecare dată când scoți ceva, iar un cast greșit s-ar opri abia când rulează programul. Cu un parametru de tip, Java verifică încă de la compilare

```java
class Cutie<T> {
    T lucru;

    Cutie(T lucru) {
        this.lucru = lucru;
    }

    T ia() {
        return lucru;
    }
}

public class Main {
    public static void main(String[] args) {
        Cutie<String> bilet = new Cutie<>("salut");
        // int n = bilet.ia();   // nu compileaza: un String nu e un int
        System.out.println(bilet.ia().toUpperCase());
    }
}
```

Ieșire

```text
SALUT
```

Parametrii de tip trebuie să fie obiecte, așa că scrii `Cutie<Integer>`, niciodată `Cutie<int>`. Clasele wrapper fac asta ușor

---

O clasă poate avea mai mulți parametri de tip. Din obișnuință primesc nume scurte, cu majusculă: `T` pentru tip, `K` și `V` pentru cheie și valoare, `A` și `B` pentru un prim și un al doilea lucru

```java
class Eticheta<K, V> {
    K nume;
    V valoare;

    Eticheta(K nume, V valoare) {
        this.nume = nume;
        this.valoare = valoare;
    }

    public String toString() {
        return nume + " = " + valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Eticheta<String, Double> taxa = new Eticheta<>("taxa", 0.2);
        System.out.println(taxa);
    }
}
```

Ieșire

```text
taxa = 0.2
```

Exact așa e construit `HashMap<K, V>`

---

## Misiune: Perechi

Scrie o clasă generică `Pereche<A, B>` care ține două valori de două tipuri. Dă-i:

- metodele `primul()` și `alDoilea()` care dau valorile înapoi
- o metodă `inverseaza()` care dă înapoi o nouă `Pereche<B, A>`, cu cele două valori invers
- un `toString()` care dă înapoi `(<primul>, <al doilea>)`

În `main`, stochează un nume într-un `String` numit `nume` și un scor într-un `int` numit `scor`. Fă din ele o `Pereche<String, Integer>` și afișeaz-o, apoi afișează inversul ei. La final, afișează `<nume> are <scor> puncte`, scoțând cele două valori din pereche cu `primul()` și `alDoilea()`.

**Exemplu** pentru `nume = "Tommy"` și `scor = 120`

```text
(Tommy, 120)
(120, Tommy)
Tommy are 120 puncte
```

**Exemplu** pentru `nume = "Ken"` și `scor = 0`

```text
(Ken, 0)
(0, Ken)
Ken are 0 puncte
```
