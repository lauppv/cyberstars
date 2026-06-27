Am văzut deja **+**, **-**, **\***, și **/** în lecțiile anterioare. Java are câțiva operatori utili în plus pe care îi întâlnim acum

```java
public class Main {
    public static void main(String[] args) {
        int a = 17;
        int b = 5;

        System.out.println(a + b);   // adunare
        System.out.println(a - b);   // scadere
        System.out.println(a * b);   // inmultire
        System.out.println(a / b);   // impartire
        System.out.println(a % b);   // rest (modulo)
    }
}
```

Output

```text
22
12
85
3
2
```

Cel interesant este **a / b = 3**, nu **3.4**. De ce? Pentru că **a** și **b** sunt amândoi **int**. Java face **împărțire întreagă** când ambii operanzi sunt numere întregi — aruncă partea zecimală. Am văzut asta într-o lecție anterioară

Dacă vrem rezultatul cu zecimale, avem nevoie de cel puțin un **double**

```java
public class Main {
    public static void main(String[] args) {
        double a = 17;
        int b = 5;
        System.out.println(a / b);   // 3.4
    }
}
```

---

Operatorul nou este **%**, numit **modulo** (sau „rest"). Ne dă **restul** împărțirii

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(17 % 5);   // 2
        System.out.println(20 % 4);   // 0
    }
}
```

**17 / 5 = 3** cu rest **2**, deci **17 % 5 = 2**. **20 / 4 = 5** exact, deci restul este **0**

**%** este incredibil de util. Exemplul clasic: să verificăm dacă un număr este **par**

```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        if (n % 2 == 0) {
            System.out.println("par");
        } else {
            System.out.println("impar");
        }
    }
}
```

---

Java are **scurtături** utile

- **a++** este același lucru cu **a = a + 1**
- **a--** este același lucru cu **a = a - 1**
- **a += 5** este același lucru cu **a = a + 5**
- **a -= 3** este același lucru cu **a = a - 3**
- **a \*= 2** este același lucru cu **a = a \* 2**
- **a /= 4** este același lucru cu **a = a / 4**

Vei vedea **i++** în bucle **for** absolut peste tot

---

Dar **puterile**? Java nu are un operator dedicat pentru putere. În schimb, folosim **Math.pow**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.pow(2, 3));   // 8.0
    }
}
```

Rezultatul este **8.0** (un double). **Math.pow** întoarce mereu un double, deci chiar și **2 la puterea 3** iese ca **8.0**, nu **8**

---

**Ordinea operațiilor** este aceeași ca în matematică. Înmulțirea și împărțirea înaintea adunării și scăderii

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(2 + 3 * 4);     // 14, nu 20
        System.out.println((2 + 3) * 4);   // 20
    }
}
```

Când ai dubii, **adaugă paranteze**. Oricum fac codul mai ușor de citit

---

## Misiune: Diagnostic Motoare

Consola de diagnostic a stației are nevoie de o citire aritmetică rapidă a două valori de la senzori.

Creează două variabile `int` care să stocheze două numere întregi. Apoi afișează, fiecare pe propria linie, rezultatul pentru: adunare, scădere, înmulțire, împărțire întreagă și rest.

**Exemplu**

Dacă cele două numere sunt `17` și `5`, programul tău ar trebui să afișeze

```text
22
12
85
3
2
```
