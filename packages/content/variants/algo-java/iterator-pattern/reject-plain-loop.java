import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int start = Integer.parseInt(in.nextLine());
        int end = Integer.parseInt(in.nextLine());
        for (int x = start; x <= end; x++) System.out.println(x);
    }
}
