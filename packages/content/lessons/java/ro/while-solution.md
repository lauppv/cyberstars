```java
public class Main {
    public static void main(String[] args) {
        int combinatiaSecreta = 3;

        int incercare = 1;
        while (true) {
            if (incercare == combinatiaSecreta) {
                System.out.println("Seif deschis");
                break;
            }
            System.out.println("Incerc " + incercare);
            incercare++;
        }
    }
}
```
