import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] entries = { "42", "tape", "-7", "300" };
        ArrayList<Integer> numbers = new ArrayList<>();
        int bad = 0;
        for (String entry : entries) {
            boolean ok = !entry.isEmpty();
            for (int i = 0; i < entry.length(); i++) {
                if (!Character.isDigit(entry.charAt(i))) ok = false;
            }
            if (ok) numbers.add(Integer.parseInt(entry));
            else bad++;
        }
        int smallest = Integer.MAX_VALUE;
        for (int n : numbers) smallest = Math.min(smallest, n);
        System.out.println("Numbers: " + numbers);
        System.out.println("Bad: " + bad);
        System.out.println("Smallest: " + (numbers.isEmpty() ? "none" : smallest));
    }
}
