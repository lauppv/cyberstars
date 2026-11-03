import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        ArrayList<Integer> items = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("enqueue")) items.add(Integer.parseInt(in.nextLine()));
            else if (items.isEmpty()) System.out.println("Empty");
            else System.out.println(cmd.equals("dequeue") ? items.remove(0) : items.get(0));
        }
    }
}
