Până acum programele tale făceau un singur lucru odată, linie după linie. Un **thread** e un fir de lucru separat în același program. Cu două thread-uri, două bucăți de cod rulează în același timp, de exemplu pe două nuclee ale procesorului

---

Cel mai simplu fel de a face un thread: scrii o clasă care extinde `Thread` și îi pui treaba într-o metodă numită `run`. Apoi o creezi și apelezi **start**

```java
class Muncitor extends Thread {
    @Override
    public void run() {
        System.out.println("Muncitor: numar banii");
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Muncitor muncitor = new Muncitor();
        muncitor.start();
        muncitor.join();
        System.out.println("Main: muncitorul a terminat");
    }
}
```

Ieșire

```text
Muncitor: numar banii
Main: muncitorul a terminat
```

- `start()` pornește thread-ul nou, iar acel thread apelează `run()`. Main nu așteaptă, trece imediat la linia următoare
- `join()` îl face pe main să aștepte până termină thread-ul
- `join` poate fi întrerupt, așa că poate arunca o `InterruptedException`. E o excepție checked, deci `main` spune `throws InterruptedException`

---

O greșeală des întâlnită e să apelezi tu `run()` în loc de `start()`. Merge, dar nu se face niciun thread nou: main rulează singur codul și nimic nu se întâmplă în același timp. Apelează mereu `start()`

---

Fără `join`, nimeni nu știe care thread afișează primul. Rulează asta de câteva ori și ordinea se poate schimba

```java
class Strigat extends Thread {
    String cuvant;

    Strigat(String cuvant) {
        this.cuvant = cuvant;
    }

    @Override
    public void run() {
        System.out.println(cuvant);
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Strigat a = new Strigat("Tommy");
        Strigat b = new Strigat("Lance");
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("Gata amandoi");
    }
}
```

`Tommy` și `Lance` pot veni în orice ordine, fiindcă cele două thread-uri chiar rulează în același timp. Doar `Gata amandoi` vine sigur ultimul, după ambele join-uri

---

Atunci cum scoți un rezultat dintr-un thread într-o ordine fixă? Lasă fiecare thread să-și țină rezultatul în câmpul lui. După join-uri, main citește câmpurile în ordinea pe care o vrea

```java
class Patrat extends Thread {
    int numar;
    int rezultat;

    Patrat(int numar) {
        this.numar = numar;
    }

    @Override
    public void run() {
        rezultat = numar * numar;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Patrat a = new Patrat(3);
        Patrat b = new Patrat(4);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(a.rezultat + b.rezultat);
    }
}
```

Ieșire

```text
25
```

E sigur să citești `a.rezultat` doar după `a.join()`. Înainte, thread-ul poate încă să lucreze

`Thread.sleep(500)` oprește thread-ul curent pentru 500 de milisecunde. Ca `join`, poate arunca o `InterruptedException`

---

## Misiune: Numărătoarea banilor

După o lovitură, banda aduce înapoi saci cu bani. Să-i numeri pe toți durează prea mult, așa că doi oameni numără în același timp: unul numără prima jumătate a sacilor, celălalt a doua jumătate.

Stochează sumele într-un array de `int` numit `saci`. Scrie o clasă `Numarator` care extinde `Thread`. Primește array-ul și intervalul de saci pe care trebuie să-l numere, de la poziția `de` până la `pana`, fără ea, și își ține suma într-un câmp.

În `main`, fă doi numărători: primul numără de la 0 la `saci.length / 2`, al doilea de acolo până la final. Pornește-i pe amândoi, așteaptă-i pe amândoi, apoi afișează:

```text
Prima jumatate: N
A doua jumatate: N
Total: N
```

**Exemplu** pentru `saci = { 100, 250, 75, 300, 5 }`

```text
Prima jumatate: 350
A doua jumatate: 380
Total: 730
```

**Exemplu** pentru `saci = { 40 }`

```text
Prima jumatate: 0
A doua jumatate: 40
Total: 40
```
