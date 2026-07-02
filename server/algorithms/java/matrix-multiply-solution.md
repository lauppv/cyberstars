```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] dimsA = sc.nextLine().trim().split("\\s+");
        int r1 = Integer.parseInt(dimsA[0]);
        int c1 = Integer.parseInt(dimsA[1]);
        int[][] a = new int[r1][c1];
        for (int i = 0; i < r1; i++) {
            String[] row = sc.nextLine().trim().split("\\s+");
            for (int j = 0; j < c1; j++) {
                a[i][j] = Integer.parseInt(row[j]);
            }
        }
        String[] dimsB = sc.nextLine().trim().split("\\s+");
        int r2 = Integer.parseInt(dimsB[0]);
        int c2 = Integer.parseInt(dimsB[1]);
        int[][] b = new int[r2][c2];
        for (int i = 0; i < r2; i++) {
            String[] row = sc.nextLine().trim().split("\\s+");
            for (int j = 0; j < c2; j++) {
                b[i][j] = Integer.parseInt(row[j]);
            }
        }

        int[][] c = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                int sum = 0;
                for (int k = 0; k < c1; k++) {
                    sum += a[i][k] * b[k][j];
                }
                c[i][j] = sum;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < r1; i++) {
            sb.setLength(0);
            for (int j = 0; j < c2; j++) {
                if (j > 0) {
                    sb.append(" ");
                }
                sb.append(c[i][j]);
            }
            System.out.println(sb);
        }
    }
}
```
