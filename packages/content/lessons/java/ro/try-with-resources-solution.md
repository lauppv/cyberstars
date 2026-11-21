```java
class Usa implements AutoCloseable {
    String vizitator;

    Usa(String vizitator) {
        this.vizitator = vizitator;
        System.out.println("Usa se deschide pentru " + vizitator);
    }

    public void close() {
        System.out.println("Usa se incuie");
    }
}

public class Main {
    public static void main(String[] args) {
        String[] vizitatori = {"Lance", "Politia", "Phil"};

        int sigure = 0;
        for (String nume : vizitatori) {
            try (Usa usa = new Usa(nume)) {
                if (usa.vizitator.equals("Politia")) {
                    throw new IllegalStateException("Politia e la usa");
                }
                System.out.println(usa.vizitator + " e inauntru");
                sigure++;
            } catch (IllegalStateException e) {
                System.out.println("Alarma: " + e.getMessage());
            }
        }
        System.out.println("Vizite sigure: " + sigure);
    }
}
```
