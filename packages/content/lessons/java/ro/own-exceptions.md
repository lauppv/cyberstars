`IllegalArgumentException` se potrivește la multe probleme, dar numele ei spune puțin. Când programul tău are propriul fel de problemă, îți poți face **propria excepție**: o clasă care extinde `Exception`

```java
class CodGresitException extends Exception {
    CodGresitException(String mesaj) {
        super(mesaj);
    }
}

public class Main {
    static void deschideSeiful(String cod) throws CodGresitException {
        if (!cod.equals("1986")) {
            throw new CodGresitException("Seiful ramane inchis");
        }
        System.out.println("Deschis");
    }

    public static void main(String[] args) {
        try {
            deschideSeiful("0000");
        } catch (CodGresitException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

Ieșire

```text
Seiful ramane inchis
```

Trei lucruri de văzut

1. `extends Exception` o face o excepție checked. Extinde `RuntimeException` dacă o vrei unchecked
2. `super(mesaj)` îi dă mesajul lui `Exception`, așa că `getMessage()` merge
3. Din obișnuință, în Java numele se termină cu `Exception`

---

Doar numele ajută deja. `catch (CodGresitException e)` prinde doar problema asta, iar celelalte excepții trec mai departe

---

O excepție e un obiect, deci poate duce mai mult decât un mesaj. Dă-i câmpuri cu detaliile, iar codul care o prinde le poate folosi

```java
class PreaTanarException extends Exception {
    int varsta;

    PreaTanarException(int varsta) {
        super("Prea tanar: " + varsta);
        this.varsta = varsta;
    }
}

public class Main {
    static void intraInClub(int varsta) throws PreaTanarException {
        if (varsta < 18) {
            throw new PreaTanarException(varsta);
        }
        System.out.println("Bine ai venit");
    }

    public static void main(String[] args) {
        try {
            intraInClub(15);
        } catch (PreaTanarException e) {
            System.out.println(e.getMessage());
            System.out.println("Revino peste " + (18 - e.varsta) + " ani");
        }
    }
}
```

Ieșire

```text
Prea tanar: 15
Revino peste 3 ani
```

---

## Misiune: Magazinul lui Phil

Phil Cassidy vinde lăzi cu artificii din curtea lui. Comenzile vin una după alta, iar Phil poate vinde doar ce are

Fă o clasă excepție `StocEpuizatException` care extinde `Exception`. Ea ține minte câte lăzi lipsesc, iar mesajul ei e `lipsesc ` și acel număr

Scrie o metodă `vinde(int stoc, int cantitate)` care întoarce stocul rămas după vânzare. Când comanda e mai mare decât stocul, aruncă în schimb o `StocEpuizatException` și nu vinde nimic

Lăzile lui Phil sunt în `int stoc`, iar comenzile într-un array `int[] comenzi`. Pentru fiecare comandă, apelează `vinde`. Dacă merge, afișează `Am vandut cantitate, au ramas stoc`. Dacă aruncă, afișează `Imi pare rau, ` și mesajul. La final afișează `Stoc ramas: ` și ce mai are Phil

**Exemplu**

```text
Am vandut 4, au ramas 6
Imi pare rau, lipsesc 2
Am vandut 6, au ramas 0
Imi pare rau, lipsesc 1
Stoc ramas: 0
```

**Exemplu**

```text
Stoc ramas: 3
```
