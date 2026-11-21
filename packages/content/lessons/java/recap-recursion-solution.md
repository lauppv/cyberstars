```java
public class Main {
    static int crack(String prefix, int digitsLeft, int sumLeft) {
        if (digitsLeft == 0) {
            if (sumLeft == 0) {
                System.out.println(prefix);
                return 1;
            }
            return 0;
        }
        int found = 0;
        for (int d = 0; d <= 9 && d <= sumLeft; d++) {
            found += crack(prefix + d, digitsLeft - 1, sumLeft - d);
        }
        return found;
    }

    public static void main(String[] args) {
        int length = 2;
        int target = 3;

        int found = crack("", length, target);
        System.out.println("Found: " + found);
    }
}
```
