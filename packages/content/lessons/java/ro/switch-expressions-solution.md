```java
public class Main {
    public static void main(String[] args) {
        String cartier = "Downtown";
        int curse = 3;

        int tarif = switch (cartier) {
            case "Ocean Beach", "Washington Beach" -> 12;
            case "Downtown" -> 15;
            case "Little Havana", "Little Haiti" -> 10;
            default -> 20;
        };
        System.out.println("Tarif: " + tarif);
        System.out.println("Total: " + tarif * curse);
    }
}
```
