La String-uri ai învățat să compari cu `.equals()`, niciodată cu `==`. Clasele tale merg la fel, cu o capcană: Java nu știe ce înseamnă „egal” pentru clasa ta până nu-i spui. I-o spui suprascriind **equals** și, împreună cu ea, **hashCode**

---

Implicit, `equals`-ul care vine de la Object face același lucru ca `==`: întreabă doar „e exact același obiect?”

```java
class Masina {
    String model;
    int an;

    Masina(String model, int an) {
        this.model = model;
        this.an = an;
    }
}

public class Main {
    public static void main(String[] args) {
        Masina a = new Masina("Infernus", 1986);
        Masina b = new Masina("Infernus", 1986);
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
```

Ieșire

```text
false
false
```

Două mașini cu același model și an, iar Java zice că nu sunt egale. Sunt două obiecte separate, și doar la asta se uită `equals`-ul implicit

---

Ca să spui „două mașini sunt egale când modelul și anul se potrivesc”, suprascrie `equals`. Primește un `Object`, fiindcă orice poate fi comparat cu orice

```java
class Masina {
    String model;
    int an;

    Masina(String model, int an) {
        this.model = model;
        this.an = an;
    }

    @Override
    public boolean equals(Object alta) {
        if (!(alta instanceof Masina)) {
            return false;
        }
        Masina m = (Masina) alta;
        return model.equals(m.model) && an == m.an;
    }
}

public class Main {
    public static void main(String[] args) {
        Masina a = new Masina("Infernus", 1986);
        Masina b = new Masina("Infernus", 1986);
        System.out.println(a.equals(b));
        System.out.println(a.equals("Infernus"));
    }
}
```

Ieșire

```text
true
false
```

Pas cu pas: dacă celălalt lucru nici măcar nu e o Masina, nu pot fi egale. Dacă e, fă cast la Masina și compară câmpurile care contează. String-urile dinăuntru se compară tot cu `equals`

---

Acum capcana. HashMap nu începe cu `equals`. Întâi cere cheii **hashCode**-ul ei, un număr care îi spune în ce sertar să caute. Două obiecte egale trebuie să dea același număr, altfel HashMap caută în sertarul greșit și nu găsește niciodată cheia

Regula: **când suprascrii equals, suprascrie și hashCode**, și construiește-l din aceleași câmpuri. `Objects.hash` o face pentru tine

```java
import java.util.HashMap;
import java.util.Objects;

class Masina {
    String model;
    int an;

    Masina(String model, int an) {
        this.model = model;
        this.an = an;
    }

    @Override
    public boolean equals(Object alta) {
        if (!(alta instanceof Masina)) {
            return false;
        }
        Masina m = (Masina) alta;
        return model.equals(m.model) && an == m.an;
    }

    @Override
    public int hashCode() {
        return Objects.hash(model, an);
    }
}

public class Main {
    public static void main(String[] args) {
        HashMap<Masina, String> proprietari = new HashMap<>();
        proprietari.put(new Masina("Infernus", 1986), "Tommy");
        System.out.println(proprietari.get(new Masina("Infernus", 1986)));
    }
}
```

Ieșire

```text
Tommy
```

Scoate `hashCode` din clasa asta și programul afișează `null`: cele două obiecte Masina ajung în sertare diferite. Multe metode folosesc `equals` în spate, ca `contains` la un ArrayList

---

## Misiune: Numărătoarea mașinilor

Showroom-ul lui Tommy a primit o listă de livrare, iar unele mașini apar de mai multe ori. Scrie o clasă `Masina` cu un `String model` și un `int an`, în care două mașini sunt egale când se potrivesc și modelul, și anul. Suprascrie `equals` și `hashCode`.

Stochează modelele într-un array de `String` numit `modele` și anii într-un array de `int` numit `ani`, în aceeași ordine: mașina numărul `i` e `modele[i]` din `ani[i]`.

Numără fiecare mașină cu un `HashMap<Masina, Integer>`. Păstrează mașinile diferite într-un `ArrayList<Masina>`, în ordinea în care le vezi prima dată, adăugând o mașină doar dacă lista nu o `contains` deja. Apoi afișează, pentru fiecare mașină diferită, `<model> <an>: <numar>`, iar la final `Masini diferite: N`.

**Exemplu** pentru `modele = { "Infernus", "Cheetah", "Infernus", "Infernus" }` și `ani = { 1986, 1986, 1986, 1985 }`

```text
Infernus 1986: 2
Cheetah 1986: 1
Infernus 1985: 1
Masini diferite: 3
```

**Exemplu** pentru `modele = { "Stinger", "Stinger" }` și `ani = { 1984, 1984 }`

```text
Stinger 1984: 2
Masini diferite: 1
```
