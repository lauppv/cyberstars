import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] entries = { "42", "tape", "-7", "300" };
        ArrayList<Integer> numbers = new ArrayList<>();
        int bad = 0;
        Integer smallest = Integer.MAX_VALUE;
        for (int i = 0; i < entries.length; i++) {
            try {
                int value = Integer.parseInt(entries[i]);
                numbers.add(value);
                smallest = Math.min(smallest, value);
            } catch (Exception e) {
                bad = bad + 1;
            }
        }
        System.out.println("Numbers: " + numbers);
        System.out.println("Bad: " + bad);
        if (numbers.size() == 0) System.out.println("Smallest: none");
        else System.out.println("Smallest: " + smallest);
    }
}
