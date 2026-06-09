Am văzut cum să stocăm numere. Dar ce ne facem cu **textul**? În Java, tipul pentru text se numește **String** (cu **S** mare, asta contează)

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume);
    }
}
```

Rulează-l. Vei vedea **Tommy Vercetti**

Putem schimba valoarea exact ca la numere

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume);

        nume = "Lance Vance";
        System.out.println(nume);

        nume = "Paul";
        System.out.println(nume);
        System.out.println(nume);
        System.out.println(nume);
    }
}
```

Output

```text
Tommy Vercetti
Lance Vance
Paul
Paul
Paul
```

Observă că **a doua oară** când schimbăm **nume**, **nu** mai scriem **String** din nou. Scriem tipul **o singură dată**, când **declarăm prima dată** variabila. După aceea, Java știe deja tipul :)

---

Exact ca în Python, **nu uita ghilimelele**. Codul de mai jos nu va funcționa

```java
public class Main {
    public static void main(String[] args) {
        String nume = Paul;   // EROARE
    }
}
```

Java crede că **Paul** este o variabilă, nu găsește una cu acel nume și dă o eroare. Ca să-i spunem "acesta este text, tratează-l exact așa cum e scris", îl punem între **""**

Un exemplu subtil

```java
public class Main {
    public static void main(String[] args) {
        String Kent = "Booooo";
        String nume = Kent;
        System.out.println(nume);
    }
}
```

Asta afișează **Booooo**, nu **Kent**. De ce? Pentru că **Kent** fără ghilimele este tratat ca o **variabilă**, iar acea variabilă conține **"Booooo"**. Ca să afișăm efectiv cuvântul **Kent** am scrie

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Kent";
        System.out.println(nume);
    }
}
```

---

Un plus drăguț în Java: variabilele de text se comportă un pic ca obiectele. Putem arunca deja o privire la un truc util

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume.length());
    }
}
```

Output **14**. **.length()** ne spune câte caractere are textul. Spațiile contează și ele. Vom explora multe alte astfel de metode într-o lecție viitoare, deocamdată observă doar **sintaxa cu punct**

---

## Misiune: Reparația Listei Echipajului

Lista echipajului stației are un bug — numele au fost introduse fără ghilimele, așa că Java crede că sunt variabile în loc de text.

Repară cele trei atribuiri de variabile astfel încât programul să compileze și să afișeze corect numele echipajului.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Shrek
Fiona
Donkey
```
