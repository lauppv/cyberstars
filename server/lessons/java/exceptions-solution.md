```java
public class Main {
    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};

        for (String report : reports) {
            try {
                int amount = Integer.parseInt(report);
                System.out.println("Payment: " + amount);
            } catch (NumberFormatException e) {
                System.out.println("Invalid report: " + report);
            }
        }
    }
}
```
