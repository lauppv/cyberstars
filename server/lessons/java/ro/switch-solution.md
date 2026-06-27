```java
public class Main {
    public static void main(String[] args) {
        String zi = "Luni";

        switch (zi) {
            case "Luni":
            case "Marti":
            case "Miercuri":
            case "Joi":
            case "Vineri":
                System.out.println("Zi lucratoare");
                break;
            case "Sambata":
            case "Duminica":
                System.out.println("Weekend");
                break;
            default:
                System.out.println("Zi necunoscuta");
                break;
        }
    }
}
```
