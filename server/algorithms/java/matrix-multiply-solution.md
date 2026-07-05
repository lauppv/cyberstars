```java
public class Main {
    public static void main(String[] args) {
        int[][] a = {
            {1, 2, 3},
            {4, 5, 6}
        };

        int[][] b = {
            {7, 8},
            {9, 10},
            {11, 12}
        };

        int r1 = a.length;
        int c1 = a[0].length;
        int c2 = b[0].length;

        // C[i][j] = sum over k of A[i][k] * B[k][j].
        int[][] c = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                int sum = 0;
                for (int k = 0; k < c1; k++) {
                    sum = sum + a[i][k] * b[k][j];
                }
                c[i][j] = sum;
            }
        }

        // Print the matrix row by row, with elements separated by spaces.
        for (int i = 0; i < r1; i++) {
            String row = "";
            for (int j = 0; j < c2; j++) {
                row = row + c[i][j];
                if (j < c2 - 1) {
                    row = row + " ";
                }
            }
            System.out.println(row);
        }
    }
}
```
