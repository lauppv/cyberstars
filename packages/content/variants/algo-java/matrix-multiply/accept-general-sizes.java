public class Main {
    static int[][] multiply(int[][] x, int[][] y) {
        int[][] out = new int[x.length][y[0].length];
        for (int i = 0; i < x.length; i++)
            for (int j = 0; j < y[0].length; j++)
                for (int k = 0; k < y.length; k++) out[i][j] += x[i][k] * y[k][j];
        return out;
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2, 3}, {4, 5, 6}};
        int[][] b = {{7, 8}, {9, 10}, {11, 12}};
        for (int[] row : multiply(a, b)) {
            StringBuilder line = new StringBuilder();
            for (int v : row) line.append(line.length() > 0 ? " " : "").append(v);
            System.out.println(line);
        }
    }
}
