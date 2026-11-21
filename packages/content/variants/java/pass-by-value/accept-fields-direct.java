class Member {
    String name;
    int pay;
}

public class Main {
    static void raisePay(int pay, int amount) {
        pay += amount;
    }

    static void raiseMember(Member who, int amount) {
        who.pay += amount;
    }

    public static void main(String[] args) {
        String name = "Lance";
        int pay = 500;
        int amount = 100;
        Member m = new Member();
        m.name = name;
        m.pay = pay;
        raisePay(pay, amount);
        System.out.println("After raisePay: " + pay);
        raiseMember(m, amount);
        System.out.println("After raiseMember: " + m.name + " earns " + m.pay);
    }
}
