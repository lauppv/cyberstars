```java
public class Main {
    public static void main(String[] args) {
        int secretCombination = 3;

        int attempt = 1;
        while (true) {
            if (attempt == secretCombination) {
                System.out.println("Safe open");
                break;
            }
            System.out.println("Trying " + attempt);
            attempt++;
        }
    }
}
```
