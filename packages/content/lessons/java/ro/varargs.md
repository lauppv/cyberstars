Unele metode ar trebui să primească oricâte valori: să adune 2 numere, sau 5, sau niciunul. Să scrii câte o metodă pentru fiecare număr ar fi caraghios. Cu **varargs** o singură metodă primește câte valori îi dă cel care o apelează

---

Scrii trei puncte după tipul ultimului parametru

```java
public class Main {
    static int suma(int... numere) {
        int total = 0;
        for (int n : numere) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(suma(4, 5));
        System.out.println(suma(1, 2, 3, 4));
        System.out.println(suma());
    }
}
```

Ieșire

```text
9
10
0
```

În metodă, `numere` e un `int[]` obișnuit. Java strânge pentru tine valorile primite într-un array. Fără nicio valoare, array-ul e pur și simplu gol

---

Fiindcă înăuntru e un array, poți da și un array pe care îl ai deja

```java
public class Main {
    static int suma(int... numere) {
        int total = 0;
        for (int n : numere) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] bacsisuri = { 10, 20, 5 };
        System.out.println(suma(bacsisuri));
    }
}
```

Ieșire

```text
35
```

---

O metodă poate avea și parametri obișnuiți, dar cel cu varargs trebuie să fie ultimul și poate fi doar unul. Altfel Java n-ar ști unde se termină valorile în plus

```java
public class Main {
    static void striga(String cine, String... cuvinte) {
        System.out.println(cine + " spune " + cuvinte.length + " cuvinte");
    }

    public static void main(String[] args) {
        striga("Lance", "hei", "Tommy");
        striga("Ken");
    }
}
```

Ieșire

```text
Lance spune 2 cuvinte
Ken spune 0 cuvinte
```

`cine` primește mereu prima valoare. Tot ce vine după merge în `cuvinte`

Ai folosit deja varargs fără să știi: `String.format` și `printf` primesc un tipar și apoi oricâte valori

---

## Misiune: Apelul

Înainte de o lovitură, Tommy face apelul. Scrie o metodă `apel` care primește numele șefului și apoi oricâte nume de membri ai bandei, și dă înapoi o linie:

* `<sef> conduce N: <nume>`, cu numele despărțite de o virgulă și un spațiu
* `<sef> lucreaza singur` când nu mai e nimeni

În `main`, stochează șeful într-un `String` numit `sef` și banda într-un array de `String` numit `banda`. Afișează apelul de două ori: întâi pentru șef cu toată banda, apoi pentru șef singur, fără să dai nicio bandă.

**Exemplu** pentru `sef = "Tommy"` și `banda = { "Lance", "Ken" }`

```text
Tommy conduce 2: Lance, Ken
Tommy lucreaza singur
```

**Exemplu** pentru `sef = "Sonny"` și `banda = { "Diaz" }`

```text
Sonny conduce 1: Diaz
Sonny lucreaza singur
```

**Exemplu** pentru `sef = "Avery"` și `banda = { }`

```text
Avery lucreaza singur
Avery lucreaza singur
```
