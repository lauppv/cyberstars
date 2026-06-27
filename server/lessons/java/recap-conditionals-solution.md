```java
public class Main {
    public static void main(String[] args) {
        int stars = 3;

        switch (stars) {
            case 0:
                System.out.println("You are clean, no pursuit");
                break;
            case 1:
                System.out.println("One police car spots you");
                break;
            case 2:
                System.out.println("Several cars chase you");
                break;
            case 3:
                System.out.println("A helicopter shows up");
                break;
            case 4:
                System.out.println("Special forces arrive");
                break;
            case 5:
                System.out.println("The FBI moves in");
                break;
            case 6:
                System.out.println("The army rolls in tanks");
                break;
            default:
                System.out.println("Invalid wanted level");
                break;
        }

        if (stars >= 5) {
            System.out.println("Critical situation, run now");
        } else if (stars >= 3) {
            System.out.println("High danger, escape fast");
        } else if (stars >= 1) {
            System.out.println("Under control, lose them in the streets");
        } else {
            System.out.println("All quiet");
        }
    }
}
```
