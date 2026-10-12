```java
import java.util.Scanner;

public class Main {
    static int cautareBinara(int[] tablou, int tinta) {
        // Tinem doi indicatori: jos si sus. In fiecare pas taiem intervalul la jumatate.
        int jos = 0;
        int sus = tablou.length - 1;

        while (jos <= sus) {
            int mijloc = (jos + sus) / 2;

            if (tablou[mijloc] == tinta) {
                return mijloc;
            } else if (tablou[mijloc] < tinta) {
                jos = mijloc + 1;
            } else {
                sus = mijloc - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        int[] tablou = new int[n];
        for (int i = 0; i < n; i++) {
            tablou[i] = Integer.parseInt(sc.nextLine());
        }

        int tinta = Integer.parseInt(sc.nextLine());

        System.out.println(cautareBinara(tablou, tinta));
    }
}
```
