```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.nextLine();
        int age = scanner.nextInt();

        System.out.println("Hello " + name + ", you are " + age + " years old. Next year you will be " + (age + 1));
    }
}
```
