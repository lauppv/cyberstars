import java.util.LinkedList;
import java.util.Queue;

class SeatException extends Exception {
    SeatException(String message) {
        super(message);
    }
}

class Plane {
    String[] seats;
    int rows;
    int cols;
    Queue<String> waiting = new LinkedList<>();

    Plane(int rows, int seatsPerRow) {
        this.rows = rows;
        this.cols = seatsPerRow;
        seats = new String[rows * seatsPerRow];
    }

    void book(String name, String code) throws SeatException {
        int row = Integer.parseInt(code.substring(0, code.length() - 1)) - 1;
        int col = code.charAt(code.length() - 1) - 'A';
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            throw new SeatException("No seat " + code);
        }
        if (seats[row * cols + col] != null) {
            throw new SeatException("Seat " + code + " is taken");
        }
        seats[row * cols + col] = name;
    }

    String bookAny(String name) {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (seats[r * cols + c] == null) {
                    seats[r * cols + c] = name;
                    return (r + 1) + "" + (char) ('A' + c);
                }
            }
        }
        waiting.offer(name);
        return null;
    }

    void printMap() {
        for (int r = 0; r < rows; r++) {
            StringBuilder line = new StringBuilder();
            line.append(r + 1).append(" ");
            for (int c = 0; c < cols; c++) {
                line.append(seats[r * cols + c] == null ? "." : "X");
            }
            System.out.println(line);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        int rows = 2;
        int seatsPerRow = 2;
        String[] bookings = {
            "Tommy:1A", "Kent:1A", "Lance:any", "Mitch:3A",
            "Kent:2B", "Phil:any", "Candy:any", "Diaz:any"
        };

        Plane plane = new Plane(rows, seatsPerRow);
        for (String booking : bookings) {
            String[] parts = booking.split(":");
            String name = parts[0];
            if (parts[1].equals("any")) {
                String seat = plane.bookAny(name);
                if (seat == null) {
                    System.out.println(name + " waits for a seat");
                } else {
                    System.out.println(name + " gets " + seat);
                }
            } else {
                try {
                    plane.book(name, parts[1]);
                    System.out.println(name + " gets " + parts[1]);
                } catch (SeatException e) {
                    System.out.println("Refused: " + e.getMessage());
                }
            }
        }

        plane.printMap();
        if (plane.waiting.isEmpty()) {
            System.out.println("Waiting: nobody");
        } else {
            System.out.println("Waiting: " + String.join(", ", plane.waiting));
        }
    }
}
