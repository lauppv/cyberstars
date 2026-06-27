În programare vrem adesea să **stocăm** lucruri ca să le folosim mai târziu. Cel mai simplu exemplu: numere. În Java, înainte de a stoca ceva, trebuie să-i spunem limbajului **ce fel de valoare** vrem să stocăm. Asta se numește **tip**

```java
public class Main {
    public static void main(String[] args) {
        int varsta = 18;
        int x = 1;
        System.out.println(varsta);
        System.out.println(x);
    }
}
```

**int** este **tipul** pentru numere întregi (1, 2, 100, -20, 0). Îi spunem lui Java: "sunt pe cale să stochez un număr întreg, iar numele lui este **varsta**"

Java este **strict** cu tipurile — vrea mereu să știe ce fel de valoare pui într-o variabilă. Avantajul este că Java poate prinde multe greșeli înainte ca programul să ruleze măcar

---

Putem face calcule cu numere

```java
public class Main {
    public static void main(String[] args) {
        int a = 2;
        int b = 6;
        int c = a + b;
        System.out.println(c);
    }
}
```

Cu semnul **=**, Java calculează mai întâi ce este în **dreapta**, apoi stochează rezultatul în variabila din **stânga**. Deci **c = a + b** stochează **8** în **c**

Clasica incrementare cu 1

```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        n = n + 1;
        System.out.println(n);
    }
}
```

Java se uită la **n + 1**, vede **10 + 1 = 11**, și stochează **11** înapoi în **n**

Java are chiar și o **scurtătură** pentru asta

```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        n++;
        System.out.println(n);
    }
}
```

**n++** este același lucru cu **n = n + 1**. Foarte des întâlnit în Java

---

Pentru numere cu zecimale (precum **3.14** sau **1.75**), **int** nu este suficient. Folosim **double**

```java
public class Main {
    public static void main(String[] args) {
        double pi = 3.14159;
        int k = 33;
        System.out.println(pi + k);
    }
}
```

Output

```text
36.14159
```

Rezultatul este un **double** pentru că am amestecat un **int** cu un **double**

**Important**: dacă încerci să stochezi o zecimală într-un **int**, Java va refuza

```java
public class Main {
    public static void main(String[] args) {
        int x = 3.14;   // eroare
    }
}
```

Încearcă. Citește eroarea. Java ne protejează de pierderea accidentală a părții zecimale

---

O mică surpriză care prinde pe toată lumea. Încearcă asta

```java
public class Main {
    public static void main(String[] args) {
        int a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```

Poate te-ai aștepta la **3.5**. Dar vei vedea **3**. De ce? Pentru că atunci când împărțim un **int** la un **int**, Java ne dă înapoi tot un **int**, aruncând zecimalele. Ca să obținem **3.5**, avem nevoie de cel puțin un **double**

```java
public class Main {
    public static void main(String[] args) {
        double a = 7;
        int b = 2;
        System.out.println(a / b);
    }
}
```

Acum vedem **3.5**. Ține minte asta — este un bug foarte des întâlnit la începători

---

## Misiune: Legitimația Ofițerului

Comandantul Cortez are nevoie de o legitimație nouă tipărită. Setează valorile corecte pentru `varsta` și `inaltime`, apoi afișează linia completă de pe ecuson.

1. Setează `varsta` la `57`
2. Setează `inaltime` la `1.67`
3. `println`-ul de la final construiește deja mesajul cu **+** — asigură-te doar că variabilele conțin valorile corecte

**Intrare** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `varsta` — vârsta ofițerului (int)
- `inaltime` — înălțimea ofițerului în metri (double)

**Exemplu**

Cu `varsta = 57` și `inaltime = 1.67`, programul tău ar trebui să afișeze

```text
Ma numesc Cortez, am 57 ani si inaltimea de 1.67 m
```
