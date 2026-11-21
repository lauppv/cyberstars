import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] moves = {"Ocean Beach", "Little Havana", "Downtown", "back", "back", "back"};
        ArrayDeque<String> trail = new ArrayDeque<String>();
        for (int i = 0; i < moves.length; i++) {
            String m = moves[i];
            if (!m.equals("back")) {
                trail.addFirst(m);
                System.out.println("Drive to " + m);
            } else if (trail.size() > 1) {
                trail.removeFirst();
                System.out.println("Back at " + trail.peekFirst());
            } else {
                System.out.println("Nowhere to go back to");
            }
        }
        String now = trail.isEmpty() ? "nowhere" : trail.peek();
        System.out.println("Now at: " + now);
    }
}
