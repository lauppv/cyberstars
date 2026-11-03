import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        List<Integer> a = new ArrayList<>();
        for (int i = 0; i < n; i++) a.add(in.nextInt());
        System.out.println(a.indexOf(in.nextInt()));
    }
}
