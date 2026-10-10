class Visitor {
    private String name;
    private static int count;

    Visitor(String who) {
        name = who;
        count = count + 1;
    }

    static int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Cortez"};
        for (int i = 0; i < names.length; i++) {
            Visitor v = new Visitor(names[i]);
        }
        System.out.println(Visitor.getCount());
    }
}
