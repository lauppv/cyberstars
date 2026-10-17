import java.util.Scanner;

public class Main {
    // grila[r][c] e celula de pe randul r, coloana c.
    static int minutePanaSeStrica(char[][] grila) {
        // Scrie codul tau aici
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int randuri = scanner.nextInt();
        int coloane = scanner.nextInt();
        char[][] grila = new char[randuri][coloane];
        for (int r = 0; r < randuri; r++) {
            String linie = scanner.next();
            for (int c = 0; c < coloane; c++) {
                grila[r][c] = linie.charAt(c);
            }
        }
        System.out.println(minutePanaSeStrica(grila));
    }
}
