public class Main {
    public static void main(String[] args) {
        int[][] a = {{1, 2, 3}, {4, 5, 6}};
        int[][] b = {{7, 8}, {9, 10}, {11, 12}};
        for (int i = 0; i < 2; i++) {
            StringBuilder line = new StringBuilder();
            for (int j = 0; j < 2; j++) line.append(j > 0 ? " " : "").append(a[i][j] * b[i][j]);
            System.out.println(line);
        }
    }
}
