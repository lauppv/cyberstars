```java
class Member {
    String name;
    int pay;

    Member(String name, int pay) {
        this.name = name;
        this.pay = pay;
    }
}

public class Main {
    static void raisePay(int pay, int amount) {
        pay = pay + amount;
    }

    static void raiseMember(Member m, int amount) {
        m.pay = m.pay + amount;
    }

    public static void main(String[] args) {
        String name = "Lance";
        int pay = 500;
        int amount = 100;

        Member member = new Member(name, pay);
        raisePay(pay, amount);
        System.out.println("After raisePay: " + pay);
        raiseMember(member, amount);
        System.out.println("After raiseMember: " + member.name + " earns " + member.pay);
    }
}
```
