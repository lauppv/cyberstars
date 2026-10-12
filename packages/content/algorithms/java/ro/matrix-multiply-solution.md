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

        // C[i][j] = suma pe k a produselor A[i][k] * B[k][j].
        int[][] c = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                int suma = 0;
                for (int k = 0; k < c1; k++) {
                    suma = suma + a[i][k] * b[k][j];
                }
                c[i][j] = suma;
            }
        }

        // Afisam matricea rand cu rand, cu elementele separate prin spatii.
        for (int i = 0; i < r1; i++) {
            String rand = "";
            for (int j = 0; j < c2; j++) {
                rand = rand + c[i][j];
                if (j < c2 - 1) {
                    rand = rand + " ";
                }
            }
            System.out.println(rand);
        }
    }
}
```
