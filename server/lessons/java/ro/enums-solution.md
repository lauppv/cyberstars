```java
enum Stare {
    ACTIVA, INCHISA, RENOVARE, DISTRUSA
}

public class Main {
    public static void descrieStare(Stare s) {
        switch (s) {
            case ACTIVA:
                System.out.println("Activa: produce bani in fiecare zi");
                break;
            case INCHISA:
                System.out.println("Inchisa: nu genereaza venit momentan");
                break;
            case RENOVARE:
                System.out.println("Renovare: se lucreaza, deschidere in curand");
                break;
            case DISTRUSA:
                System.out.println("Distrusa: trebuie reconstruita de la zero");
                break;
        }
    }

    public static void main(String[] args) {
        for (Stare s : Stare.values()) {
            descrieStare(s);
        }
    }
}
```
