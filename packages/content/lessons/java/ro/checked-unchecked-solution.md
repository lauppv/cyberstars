```java
public class Main {
    static int verificaCod(String cod) throws Exception {
        if (cod.length() != 4) {
            throw new Exception("trebuie sa aiba 4 caractere");
        }
        return Integer.parseInt(cod);
    }

    public static void main(String[] args) {
        String[] coduri = {"1986", "12345", "19x6", "0042"};

        int bune = 0;
        for (String cod : coduri) {
            try {
                verificaCod(cod);
                System.out.println("Cod bun: " + cod);
                bune++;
            } catch (NumberFormatException e) {
                System.out.println("Nu e numar: " + cod);
            } catch (Exception e) {
                System.out.println("Cod gresit: " + e.getMessage());
            }
        }
        System.out.println("Coduri bune: " + bune);
    }
}
```
