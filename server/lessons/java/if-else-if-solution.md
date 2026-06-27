```java
public class Main {
    public static void main(String[] args) {
        int seconds = 60;

        if (seconds == 100) {
            System.out.println("Starting all onboard computers");
        } else if (seconds == 60) {
            System.out.println("Checking connection with the control tower");
        } else if (seconds == 20) {
            System.out.println("Starting secondary engines");
        } else if (seconds == 10) {
            System.out.println("Starting the main engines");
        } else {
            System.out.println("Standing by...");
        }
    }
}
```
