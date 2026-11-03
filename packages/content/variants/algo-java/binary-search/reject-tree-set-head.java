import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        TreeSet<Integer> a = new TreeSet<>();
        for (int i = 0; i < n; i++) a.add(in.nextInt());
        int target = in.nextInt();
        Integer floor = a.floor(target);
        System.out.println(floor != null && floor == target ? a.headSet(target).size() : -1);
    }
}
