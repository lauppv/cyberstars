```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] dimA = sc.nextLine().trim().split("\\s+");
        int r1 = Integer.parseInt(dimA[0]);
        int c1 = Integer.parseInt(dimA[1]);
        int[][] a = new int[r1][c1];
        for (int i = 0; i < r1; i++) {
            String[] rand = sc.nextLine().trim().split("\\s+");
            for (int j = 0; j < c1; j++) {
                a[i][j] = Integer.parseInt(rand[j]);
            }
        }
        String[] dimB = sc.nextLine().trim().split("\\s+");
        int r2 = Integer.parseInt(dimB[0]);
        int c2 = Integer.parseInt(dimB[1]);
        int[][] b = new int[r2][c2];
        for (int i = 0; i < r2; i++) {
            String[] rand = sc.nextLine().trim().split("\\s+");
            for (int j = 0; j < c2; j++) {
                b[i][j] = Integer.parseInt(rand[j]);
            }
        }

        int[][] c = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                int suma = 0;
                for (int k = 0; k < c1; k++) {
                    suma += a[i][k] * b[k][j];
                }
                c[i][j] = suma;
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
