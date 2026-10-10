public class Main {
    static Object[] CrewMember(String name, String role, int years) {
        return new Object[] { name, role, years, 50 };
    }

    static void raise(Object[] member, int amount) {
        member[3] = Math.min(100, (int) member[3] + amount);
    }

    static void train(Object[] member) {
        raise(member, 15);
    }

    static void mission(Object[] member) {
        raise(member, 10);
    }

    static String describe(Object[] m) {
        return m[0] + " (" + m[1] + ", " + m[2] + " years) - Respect: " + m[3];
    }

    public static void main(String[] args) {
        String name1 = "Tommy Vercetti";
        String role1 = "Boss";
        int years1 = 3;
        String name2 = "Lance Vance";
        String role2 = "Partner";
        int years2 = 5;
        String name3 = "Phil Cassidy";
        String role3 = "Gunsmith";
        int years3 = 2;

        Object[] a = CrewMember(name1, role1, years1);
        Object[] b = CrewMember(name2, role2, years2);
        Object[] c = CrewMember(name3, role3, years3);
        train(a);
        train(a);
        mission(a);
        mission(b);
        for (int i = 0; i < 4; i++) {
            train(c);
        }
        System.out.println(describe(a));
        System.out.println(describe(b));
        System.out.println(describe(c));
    }
}
