```java
class Solutie {
    static boolean acelasiArbore(Nod primul, Nod alDoilea) {
        if (primul == null || alDoilea == null) {
            return primul == null && alDoilea == null;
        }
        return primul.valoare == alDoilea.valoare
                && acelasiArbore(primul.stanga, alDoilea.stanga)
                && acelasiArbore(primul.dreapta, alDoilea.dreapta);
    }
}
```
