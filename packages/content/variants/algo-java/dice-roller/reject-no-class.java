import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int sides = Integer.parseInt(in.nextLine());
        Random random = new Random(Long.parseLong(in.nextLine()));
        int rolls = Integer.parseInt(in.nextLine());
        for (int i = 0; i < rolls; i++) System.out.println(random.nextInt(sides) + 1);
    }
}
