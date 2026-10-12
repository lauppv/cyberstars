```java
public class Main {
    public static void main(String[] args) {
        boolean employee = true;
        boolean workingDay = true;
        boolean guest = false;
        boolean invitation = false;

        if ((employee && workingDay) || (guest && invitation)) {
            System.out.println("Access granted");
        } else {
            System.out.println("Access denied");
        }
    }
}
```
