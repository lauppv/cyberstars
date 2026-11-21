Într-o metodă generică nu știi nimic despre `T`, așa că poți apela doar ce are orice obiect. Dar dacă ai nevoie de mai mult? Ca să găsești cel mai mare element trebuie să compari elemente. Ca să aduni numere, trebuie să fie numere. Un **tip mărginit** pune o limită: `T` poate fi orice tip, cu condiția să fie de un anumit fel

---

`<T extends Comparable<T>>` înseamnă: orice tip care știe să se compare, ca String, Integer sau Double. Acum ai voie să apelezi `compareTo`

```java
public class Main {
    static <T extends Comparable<T>> T celMaiMare(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(celMaiMare(4, 9));
        System.out.println(celMaiMare("Lance", "Ken"));
    }
}
```

Ieșire

```text
9
Lance
```

`compareTo` dă un număr pozitiv când `a` vine după `b`. La String-uri asta înseamnă mai târziu în alfabet, așa că `"Lance"` câștigă în fața lui `"Ken"`

Încearcă să apelezi `celMaiMare` cu două obiecte ale unei clase care nu implementează Comparable, și Java refuză să compileze. Asta e limita care își face treaba

---

`<T extends Number>` înseamnă: orice fel de număr. Integer, Double și Long extind toate clasa `Number`, care îi dă fiecăruia `doubleValue()`

```java
import java.util.ArrayList;

public class Main {
    static <T extends Number> double suma(ArrayList<T> valori) {
        double total = 0;
        for (T v : valori) {
            total += v.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        ArrayList<Integer> intregi = new ArrayList<>();
        intregi.add(3);
        intregi.add(4);
        ArrayList<Double> zecimale = new ArrayList<>();
        zecimale.add(1.5);
        System.out.println(suma(intregi));
        System.out.println(suma(zecimale));
    }
}
```

Ieșire

```text
7.0
1.5
```

`extends` merge aici și pentru interfețe, ca Comparable. Într-o limită înseamnă doar „e un fel de”

---

Există un fel mai scurt de a scrie o metodă ca `suma`. Când nu ai nevoie de numele `T` nicăieri altundeva, scrie tipul listei ca `ArrayList<? extends Number>`: „o listă de un fel de număr”. `?` se numește **wildcard**

```java
import java.util.ArrayList;

public class Main {
    static double suma(ArrayList<? extends Number> valori) {
        double total = 0;
        for (Number v : valori) {
            total += v.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        ArrayList<Integer> intregi = new ArrayList<>();
        intregi.add(10);
        System.out.println(suma(intregi));
    }
}
```

Ieșire

```text
10.0
```

De ce nu doar `ArrayList<Number>`? Fiindcă un `ArrayList<Integer>` nu e un `ArrayList<Number>`, chiar dacă orice Integer e un Number. Wildcard-ul e cel care lasă să intre ambele feluri de liste

---

Încă o unealtă înainte de misiune. Ca să faci într-o singură linie o listă care ține deja niște valori, folosește `List.of` între parantezele ArrayList-ului. Are nevoie de `import java.util.List;`

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> banda = new ArrayList<>(List.of("Tommy", "Lance"));
        banda.add("Ken");
        System.out.println(banda);
    }
}
```

Ieșire

```text
[Tommy, Lance, Ken]
```

---

## Misiune: Tabla cursei

Scrie două metode pentru tabla de curse a lui Tommy:

- `celMaiBun(ArrayList<T> lucruri)`, o metodă generică cu `T extends Comparable<T>`, dă înapoi cel mai mare element, folosind `compareTo`
- `total(ArrayList<? extends Number> valori)` dă înapoi suma valorilor ca `double`

În `main`, stochează niște nume într-un `ArrayList<String>` numit `nume`, scorurile într-un `ArrayList<Integer>` numit `scoruri` și timpii pe tur într-un `ArrayList<Double>` numit `timpi`. Fă fiecare listă cu `List.of`. Fiecare listă are cel puțin un element. Afișează:

```text
Ultimul nume: <numele care vine ultimul in alfabet>
Cel mai mare scor: <cel mai mare scor>
Totalul scorurilor: <suma scorurilor>
Totalul timpilor: <suma timpilor>
```

**Exemplu** pentru `nume = [Tommy, Ken, Lance]`, `scoruri = [120, 85, 40]` și `timpi = [61.5, 58.25]`

```text
Ultimul nume: Tommy
Cel mai mare scor: 120
Totalul scorurilor: 245.0
Totalul timpilor: 119.75
```

**Exemplu** pentru `nume = [Phil]`, `scoruri = [-3]` și `timpi = [0.5]`

```text
Ultimul nume: Phil
Cel mai mare scor: -3
Totalul scorurilor: -3.0
Totalul timpilor: 0.5
```
