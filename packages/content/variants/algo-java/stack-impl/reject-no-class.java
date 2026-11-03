import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        ArrayList<Integer> data = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("push")) {
                data.add(Integer.parseInt(in.nextLine()));
            } else if (data.isEmpty()) {
                System.out.println("Empty");
            } else if (cmd.equals("pop")) {
                System.out.println(data.remove(data.size() - 1));
            } else {
                System.out.println(data.get(data.size() - 1));
            }
        }
    }
}
