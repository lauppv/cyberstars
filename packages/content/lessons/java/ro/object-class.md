Orice clasă pe care o scrii are un părinte, chiar și când nu scrii `extends`. Java o face în liniște să extindă o clasă numită **Object**. Object stă în vârful fiecărui arbore genealogic, așa că orice obiect din Java e și un Object

---

De aceea, orice obiect are câteva metode de la început, chiar și o clasă goală:

- `toString()`, un text pentru obiect
- `equals(altul)`, e egal cu alt obiect?
- `hashCode()`, un număr folosit de HashMap și prietenii lui
- `getClass()`, ce clasă e de fapt obiectul

```java
class Masina {
}

public class Main {
    public static void main(String[] args) {
        Masina masina = new Masina();
        System.out.println(masina.getClass().getSimpleName());
        System.out.println(masina.equals(masina));
    }
}
```

Ieșire

```text
Masina
true
```

`Masina` nu declară nicio metodă, și totuși `getClass` și `equals` merg. Vin de la Object

---

`toString`-ul pe care îl primești de la Object nu e prea util: numele clasei, un `@` și un număr în hex, ceva ca `Masina@7a81197d`. De aceea îl suprascrii, cum ai făcut în lecția toString(). Când scrii `println(masina)` sau `"text" + masina`, Java apelează pentru tine `toString()`-ul obiectului

---

Fiindcă orice obiect e un Object, o variabilă de tip `Object` poate ține orice: un String, o Masina, un număr

```java
public class Main {
    public static void main(String[] args) {
        Object[] cutie = { "Tommy", 42, 3.5 };
        for (Object lucru : cutie) {
            System.out.println(lucru.getClass().getSimpleName() + " " + lucru);
        }
    }
}
```

Ieșire

```text
String Tommy
Integer 42
Double 3.5
```

Un număr nu poate sta direct într-o variabilă Object, așa că Java îl împachetează pentru tine într-un obiect: `42` devine un `Integer`, `3.5` devine un `Double`. Vei afla mai multe despre ele în lecția Clase wrapper

---

Există un preț: printr-o variabilă `Object` poți apela doar metodele lui Object. Ca să folosești ce are clasa adevărată, verifică tipul cu `instanceof` și fă un cast, cum ai făcut cu Driver și CrewMember

```java
public class Main {
    public static void main(String[] args) {
        Object[] cutie = { "Tommy", 42, "Lance" };
        int litere = 0;
        for (Object lucru : cutie) {
            if (lucru instanceof String) {
                String text = (String) lucru;
                litere += text.length();
            }
        }
        System.out.println(litere);
    }
}
```

Ieșire

```text
10
```

---

## Misiune: Camera de probe

Poliția a confiscat o cutie de probe dintr-unul din depozitele lui Tommy: unele lucruri sunt etichete, altele sunt numere, toate amestecate. Stochează-le într-un array de `Object` numit `probe`.

1. Pentru fiecare lucru, afișează `<numele clasei>: <lucru>`, cu numele clasei din `getClass().getSimpleName()`
2. Apoi afișează `Texte: N`, câte lucruri sunt String-uri
3. Apoi afișează `Suma numerelor: N`, suma tuturor lucrurilor care sunt Integer. Folosește `instanceof` și un cast

**Exemplu** pentru `probe = { "cutit", 3, "poza", 10 }`

```text
String: cutit
Integer: 3
String: poza
Integer: 10
Texte: 2
Suma numerelor: 13
```

**Exemplu** pentru `probe = { 7 }`

```text
Integer: 7
Texte: 0
Suma numerelor: 7
```
