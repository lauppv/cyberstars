```java
public class Main {
    public static int growth(int factor, int days) {
        int result = 1;
        for (int i = 0; i < days; i++) {
            result = result * factor;
        }
        return result;
    }

    public static void main(String[] args) {
        int factor = 2;
        int days = 3;

        System.out.println(growth(factor, days));
    }
}
```
