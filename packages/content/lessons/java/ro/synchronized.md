Thread-urile care ating doar datele lor sunt ușoare. Necazul începe când două thread-uri schimbă **aceleași** date în același timp. Rezultatul depinde de cine ajunge primul, iar asta se numește **race condition**

---

Două thread-uri adună fiecare 1 la un contor comun, de 10000 de ori. Te-ai aștepta la 20000

```java
class Contor {
    int valoare = 0;

    void aduna() {
        valoare++;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Contor contor = new Contor();
        Runnable treaba = () -> {
            for (int i = 0; i < 10000; i++) {
                contor.aduna();
            }
        };
        Thread a = new Thread(treaba);
        Thread b = new Thread(treaba);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(contor.valoare);
    }
}
```

Rulează-l de câteva ori. Des primești mai puțin de 20000, și alt număr de fiecare dată

De ce? `valoare++` pare un singur pas, dar sunt trei: citește valoarea, adună 1, scrie-o înapoi. Dacă ambele thread-uri citesc 41 în același moment, amândouă scriu 42, iar una dintre adunări se pierde

---

Soluția e să lași un singur thread odată în metodă. Marcheaz-o **synchronized**

```java
class Contor {
    int valoare = 0;

    synchronized void aduna() {
        valoare++;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Contor contor = new Contor();
        Runnable treaba = () -> {
            for (int i = 0; i < 10000; i++) {
                contor.aduna();
            }
        };
        Thread a = new Thread(treaba);
        Thread b = new Thread(treaba);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(contor.valoare);
    }
}
```

Ieșire

```text
20000
```

Fiecare obiect are un lacăt. Un thread care apelează o metodă synchronized ia întâi lacătul obiectului. Dacă îl ține alt thread, cel nou așteaptă la ușă până se eliberează lacătul. Așa cei trei pași ai lui `valoare++` nu se mai pot amesteca

---

Poți încuia și doar câteva linii, cu un **bloc synchronized**. Numești obiectul al cărui lacăt îl iei

```java
public class Main {
    static int total = 0;
    static final Object LACAT = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable treaba = () -> {
            for (int i = 0; i < 5000; i++) {
                synchronized (LACAT) {
                    total += 2;
                }
            }
        };
        Thread a = new Thread(treaba);
        Thread b = new Thread(treaba);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(total);
    }
}
```

Ieșire

```text
20000
```

Ține partea încuiată mică. Cât timp un thread ține lacătul, celelalte așteaptă, așa că o parte încuiată mare face thread-urile să lucreze pe rând în loc de în același timp

---

## Misiune: Seiful băncii

Mai mulți casieri pun bani în același seif în același timp. Scrie o clasă `Seif` cu o metodă `depune(int suma)` care adună suma la sold și numără depunerea. Fă-o sigură cu `synchronized`.

În `main`, stochează numărul de casieri într-un `int` numit `casieri`, câte depuneri face fiecare casier într-un `int` numit `depuneri` și suma fiecărei depuneri într-un `int` numit `suma`. Pornește câte un thread pentru fiecare casier, fiecare făcându-și depunerile în același seif. Așteaptă-i pe toți, apoi afișează:

```text
Depuneri facute: N
Sold: N
```

**Exemplu** pentru `casieri = 4`, `depuneri = 1000` și `suma = 10`

```text
Depuneri facute: 4000
Sold: 40000
```

**Exemplu** pentru `casieri = 1`, `depuneri = 3` și `suma = 50`

```text
Depuneri facute: 3
Sold: 150
```
