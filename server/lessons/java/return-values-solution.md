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
        System.out.println(growth(2, 3));
        System.out.println(growth(5, 2));
        System.out.println(growth(7, 0));
    }
}
```
