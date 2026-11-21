```java
class Usa implements AutoCloseable {
    String vizitator;

    Usa(String vizitator) {
        this.vizitator = vizitator;
        System.out.println("Ușa se deschide pentru " + vizitator);
    }

    public void close() {
        System.out.println("Ușa se încuie");
    }
}

public class Main {
    public static void main(String[] args) {
        String[] vizitatori = {"Lance", "Politia", "Phil"};

        int sigure = 0;
        for (String nume : vizitatori) {
            try (Usa usa = new Usa(nume)) {
                if (usa.vizitator.equals("Politia")) {
                    throw new IllegalStateException("Poliția e la ușă");
                }
                System.out.println(usa.vizitator + " e înăuntru");
                sigure++;
            } catch (IllegalStateException e) {
                System.out.println("Alarmă: " + e.getMessage());
            }
        }
        System.out.println("Vizite sigure: " + sigure);
    }
}
```
