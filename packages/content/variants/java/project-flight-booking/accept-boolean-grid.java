import java.util.*;

public class Main {
    static class SeatException extends Exception {
        SeatException(String msg) { super(msg); }
    }

    static boolean[][] taken;
    static Deque<String> line = new ArrayDeque<>();

    static void book(String code) throws SeatException {
        char letter = code.charAt(code.length() - 1);
        int r = Integer.parseInt(code.substring(0, code.length() - 1)) - 1;
        int c = letter - 'A';
        boolean exists = r >= 0 && r < taken.length && c >= 0 && c < taken[0].length;
        if (!exists) throw new SeatException("No seat " + code);
        if (taken[r][c]) throw new SeatException("Seat " + code + " is taken");
        taken[r][c] = true;
    }

    static String any() {
        for (int r = 0; r < taken.length; r++)
            for (int c = 0; c < taken[r].length; c++)
                if (!taken[r][c]) { taken[r][c] = true; return String.valueOf(r + 1) + (char) ('A' + c); }
        return null;
    }

    public static void main(String[] args) {
        int rows = 2;
        int seatsPerRow = 2;
        String[] bookings = {"Tommy:1A", "Kent:1A", "Lance:any", "Mitch:3A", "Kent:2B", "Phil:any", "Candy:any", "Diaz:any"};
        taken = new boolean[rows][seatsPerRow];
        for (String b : bookings) {
            String[] p = b.split(":");
            if (p[1].equals("any")) {
                String s = any();
                if (s != null) System.out.println(p[0] + " gets " + s);
                else { line.addLast(p[0]); System.out.println(p[0] + " waits for a seat"); }
                continue;
            }
            try {
                book(p[1]);
                System.out.println(p[0] + " gets " + p[1]);
            } catch (SeatException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        for (int r = 0; r < rows; r++) {
            String row = (r + 1) + " ";
            for (int c = 0; c < seatsPerRow; c++) row += taken[r][c] ? "X" : ".";
            System.out.println(row);
        }
        System.out.println("Waiting: " + (line.isEmpty() ? "nobody" : String.join(", ", line)));
    }
}
