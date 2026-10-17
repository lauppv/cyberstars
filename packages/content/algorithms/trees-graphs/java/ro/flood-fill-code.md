import java.util.Scanner;

public class Main {
    // grila[r][c] e celula de pe randul r, coloana c.
    static void umpleZona(char[][] grila, int r, int c, char culoare) {
        // Scrie codul tau aici
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
        int r = scanner.nextInt();
        int c = scanner.nextInt();
        char culoare = scanner.next().charAt(0);
        umpleZona(grila, r, c, culoare);
        for (char[] rand : grila) {
            System.out.println(new String(rand));
        }
    }
}
