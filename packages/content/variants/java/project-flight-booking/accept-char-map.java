import java.util.ArrayList;

class SeatException extends Exception {
    SeatException(String m) { super(m); }
}

public class Main {
    public static void main(String[] args) {
        int rows = 2;
        int seatsPerRow = 2;
        String[] bookings = {"Tommy:1A", "Kent:1A", "Lance:any", "Mitch:3A", "Kent:2B", "Phil:any", "Candy:any", "Diaz:any"};
        char[][] map = new char[rows][seatsPerRow];
        for (char[] row : map) java.util.Arrays.fill(row, '.');
        ArrayList<String> waiting = new ArrayList<>();
        for (String b : bookings) {
            int colon = b.indexOf(':');
            String who = b.substring(0, colon), want = b.substring(colon + 1);
            try {
                if (want.equals("any")) {
                    int free = -1;
                    for (int k = 0; k < rows * seatsPerRow && free < 0; k++)
                        if (map[k / seatsPerRow][k % seatsPerRow] == '.') free = k;
                    if (free < 0) { waiting.add(who); System.out.println(who + " waits for a seat"); continue; }
                    map[free / seatsPerRow][free % seatsPerRow] = 'X';
                    System.out.println(who + " gets " + (free / seatsPerRow + 1) + (char) ('A' + free % seatsPerRow));
                } else {
                    int r = Integer.parseInt(want.substring(0, want.length() - 1)) - 1;
                    int c = want.charAt(want.length() - 1) - 'A';
                    if (r < 0 || c < 0 || r >= rows || c >= seatsPerRow) throw new SeatException("No seat " + want);
                    if (map[r][c] == 'X') throw new SeatException("Seat " + want + " is taken");
                    map[r][c] = 'X';
                    System.out.println(who + " gets " + want);
                }
            } catch (SeatException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        for (int r = 0; r < rows; r++) System.out.println((r + 1) + " " + new String(map[r]));
        System.out.println("Waiting: " + (waiting.isEmpty() ? "nobody" : String.join(", ", waiting)));
    }
}
