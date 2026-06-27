Când ceva merge prost la rulare — împărțire la zero, acces la un indice inexistent, parsare de text invalid — Java aruncă o **excepție** și programul se prăbușește. **try/catch** te lasă să prinzi eroarea și să continui

```java
public class Main {
    public static void main(String[] args) {
        try {
            int rezultat = 10 / 0;
            System.out.println(rezultat);
        } catch (ArithmeticException e) {
            System.out.println("Nu se poate imparti la zero!");
        }
        System.out.println("Programul continua...");
    }
}
```

Output

```text
Nu se poate imparti la zero!
Programul continua...
```

Fără try/catch, programul s-ar opri la `10 / 0`. Cu el, Java **prinde** eroarea, rulează blocul catch și merge mai departe

---

Structura de bază

```java
public class Main {
    public static void main(String[] args) {
        try {
            // cod care ar putea esua
        } catch (TipExceptie e) {
            // ce sa faci daca esueza
        }
    }
}
```

`e` este obiectul excepție. Poți apela `e.getMessage()` ca să obții o descriere a ce a mers prost

```java
public class Main {
    public static void main(String[] args) {
        try {
            int[] numere = {1, 2, 3};
            System.out.println(numere[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Eroare: " + e.getMessage());
        }
    }
}
```

Output

```text
Eroare: Index 10 out of bounds for length 3
```

---

Tipurile cele mai comune de excepții

- **ArithmeticException** — împărțire la zero
- **ArrayIndexOutOfBoundsException** — indice de array inexistent
- **NumberFormatException** — parsare de string care nu e număr valid
- **NullPointerException** — folosirea unei variabile care este null
- **ClassCastException** — conversie de obiect invalidă

Poți prinde o `Exception` generală, dar e mai bine să fii specific — tratezi fiecare situație diferit

---

Poți avea **mai multe blocuri catch**

```java
public class Main {
    public static void main(String[] args) {
        try {
            String text = "hello";
            int numar = Integer.parseInt(text);
        } catch (NumberFormatException e) {
            System.out.println("Nu e un numar: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Altceva a mers prost: " + e.getMessage());
        }
    }
}
```

Java încearcă fiecare catch de sus în jos și îl folosește pe **primul care se potrivește**. Pune excepțiile specifice înaintea celor generale

---

Blocul **finally** rulează oricum — fie că try-ul a reușit, fie că o excepție a fost prinsă

```java
public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Se incearca...");
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Eroare prinsa!");
        } finally {
            System.out.println("Asta ruleaza mereu");
        }
    }
}
```

Output

```text
Se incearca...
Eroare prinsa!
Asta ruleaza mereu
```

Util pentru curățenie — închiderea fișierelor, eliberarea resurselor

---

**Când try/catch vs verificare directă?**

Nu folosi try/catch ca pe o cârjă. Dacă știi că un array are 3 elemente, nu accesa indicele 10 — verifică pur și simplu. Folosește try/catch pentru lucruri pe care nu le poți prezice: input de la utilizator, parsare de text

---

## Misiune: Plățile din Vice City

Tommy primește plăți de la afacerile sale, dar unele rapoarte vin corupte. Phil trimite `"7500"`, Lance trimite `"nu stiu"`, Mercedes trimite `"23000"` și Cortez trimite `"eroare"`. Tommy trebuie să parseze fiecare sumă și să trateze rapoartele invalide

Parcurge lista de rapoarte, încearcă să parsezi fiecare ca număr cu `Integer.parseInt()`. Dacă reușește, afișează suma. Dacă nu, prinde excepția și afișează ce a mers prost

**Exemplu**

```text
Plata: 7500
Raport invalid: nu stiu
Plata: 23000
Raport invalid: eroare
```
