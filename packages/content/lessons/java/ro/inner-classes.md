O clasă poate locui în altă clasă. Când clasa dinăuntru are sens doar ca parte a celei din afară, dacă o pui acolo le ții împreună. Java are două feluri: **clase interioare** și **clase imbricate statice**

---

O **clasă interioară** e declarată în altă clasă, fără `static`. Fiecare obiect al ei aparține unui obiect al clasei din afară și poate citi direct câmpurile acelui obiect

```java
class Garaj {
    String proprietar;

    Garaj(String proprietar) {
        this.proprietar = proprietar;
    }

    class Masina {
        String model;

        Masina(String model) {
            this.model = model;
        }

        String eticheta() {
            return model + " din garajul lui " + proprietar;
        }
    }

    Masina parcheaza(String model) {
        return new Masina(model);
    }
}

public class Main {
    public static void main(String[] args) {
        Garaj garaj = new Garaj("Tommy");
        Garaj.Masina masina = garaj.parcheaza("Infernus");
        System.out.println(masina.eticheta());
    }
}
```

Ieșire

```text
Infernus din garajul lui Tommy
```

Uită-te la `eticheta()`: folosește `proprietar`, un câmp al lui Garaj, ca și cum ar fi al ei. Masina a fost făcută de `garaj.parcheaza(...)`, așa că știe cărui garaj îi aparține. Din afară, tipul se scrie `Garaj.Masina`

---

O **clasă imbricată statică** are `static` în față. Nu aparține niciunui obiect din afară, așa că nu poate citi câmpurile clasei din afară. E doar o clasă ținută în alta pentru ordine

```java
class Cursa {
    static class Rezultat {
        String pilot;
        int timp;

        Rezultat(String pilot, int timp) {
            this.pilot = pilot;
            this.timp = timp;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Cursa.Rezultat r = new Cursa.Rezultat("Lance", 61);
        System.out.println(r.pilot + " " + r.timp);
    }
}
```

Ieșire

```text
Lance 61
```

O creezi cu `new Cursa.Rezultat(...)`, fără niciun obiect Cursa

---

Pe care s-o alegi? Dacă clasa dinăuntru are nevoie de datele obiectului din afară, fă-o clasă interioară. Dacă nu, fă-o imbricată statică: e mai simplă și mai ușoară

---

## Misiune: Ecusoanele bandei

Tommy tipărește ecusoane pentru banda lui. Scrie o clasă `Banda` cu un `String nume` și un `ArrayList` de membri. În ea, scrie o clasă interioară `Membru` cu un `String porecla` și o metodă `ecuson()` care dă înapoi `<porecla> (<numele bandei>)`, citind numele bandei căreia îi aparține.

Dă-i clasei `Banda` o metodă `recruteaza(String porecla)` care creează un `Membru` și îl adaugă în listă.

În `main`, stochează numele bandei într-un `String` numit `numeBanda` și poreclele într-un array de `String` numit `porecle`. Recrutează-i pe toți, apoi afișează ecusonul fiecărui membru și la final `Membri: N`.

**Exemplu** pentru `numeBanda = "Banda Vercetti"` și `porecle = { "Lance", "Ken" }`

```text
Lance (Banda Vercetti)
Ken (Banda Vercetti)
Membri: 2
```

**Exemplu** pentru `numeBanda = "Rechinii"` și `porecle = { }`

```text
Membri: 0
```
