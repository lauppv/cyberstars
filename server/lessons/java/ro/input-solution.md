```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nume = scanner.nextLine();
        int varsta = scanner.nextInt();

        System.out.println("Salut " + nume + ", ai " + varsta + " de ani. Anul viitor vei avea " + (varsta + 1));
    }
}
```
