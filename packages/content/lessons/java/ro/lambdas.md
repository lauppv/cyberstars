Îți amintești Comparator-ul anonim de mai devreme? O clasă întreagă, doar ca să spui „compară după lungime”

```text
nume.sort(new Comparator<String>() {
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});
```

Un **lambda** spune același lucru într-un singur rând scurt

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> nume = new ArrayList<>();
        nume.add("Mercedes");
        nume.add("Phil");
        nume.add("Lance");

        nume.sort((a, b) -> a.length() - b.length());
        System.out.println(nume);
    }
}
```

Ieșire

```text
[Phil, Lance, Mercedes]
```

`(a, b) -> a.length() - b.length()` e un lambda. În stânga săgeții sunt intrările, în dreapta e ce întoarce. Java vede că `sort` vrea un Comparator, așa că știe că `a` și `b` sunt String-uri

---

Un lambda e o mică bucată de cod pe care o poți da unei metode, ca pe o valoare. Are câteva forme

```text
x -> x * 2                  // o intrare: nu trebuie paranteze
(a, b) -> a + b             // două intrări: paranteze
() -> "salut"               // nicio intrare: paranteze goale
x -> {                      // mai multe rânduri: acolade și return
    int y = x * 2;
    return y + 1;
}
```

---

Listele au metode care primesc un lambda. `forEach` îl rulează pentru fiecare element

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Tommy");
        echipa.add("Lance");

        echipa.forEach(nume -> System.out.println("Salut, " + nume));
    }
}
```

Ieșire

```text
Salut, Tommy
Salut, Lance
```

---

`removeIf` scoate fiecare element pentru care lambda-ul spune `true`. Nu ai nevoie de iterator

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> mite = new ArrayList<>();
        mite.add(500);
        mite.add(20);
        mite.add(1000);
        mite.add(5);

        mite.removeIf(m -> m < 100);
        System.out.println(mite);
    }
}
```

Ieșire

```text
[500, 1000]
```

---

Un lambda poate folosi variabile din jurul lui, atâta timp cât ele nu se mai schimbă după ce își primesc valoarea

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> preturi = new ArrayList<>();
        preturi.add(30000);
        preturi.add(90000);
        preturi.add(60000);

        int limita = 50000;
        preturi.removeIf(p -> p > limita);
        System.out.println(preturi);
    }
}
```

Ieșire

```text
[30000]
```

Dacă scrii mai târziu `limita = 1;` undeva, programul nu se compilează

---

## Misiune: În Limita Bugetului

Lance vrea o mașină nouă de la Sunshine Autos, dar poate plăti doar până la o sumă. Vrea să vadă mașinile pe care și le permite, cea mai scumpă prima, pentru că vrea cea mai bună pe care o poate plăti

Prețurile mașinilor din parcare sunt într-un array `int[] preturi`, iar banii lui Lance sunt în `int buget`. Pune prețurile într-un ArrayList. Scoate fiecare preț mai mare decât `buget`, sortează restul de la cel mai mare la cel mai mic și afișează fiecare ca `$pret`. Apoi afișează `Opțiuni: ` și câte mașini au rămas. Folosește lambda-uri pentru scos, sortat și afișat

**Exemplu**

```text
$45000
$32000
$32000
$9000
Opțiuni: 4
```

**Exemplu**

```text
Opțiuni: 0
```
