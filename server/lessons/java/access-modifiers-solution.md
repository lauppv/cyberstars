```java
class Wallet {
    private int money;

    public Wallet(int money) {
        this.money = money;
    }

    public void addMoney(int amount) {
        if (amount > 0) {
            money += amount;
        }
    }

    public void spendMoney(int amount) {
        if (amount > 0 && amount <= money) {
            money -= amount;
        }
    }

    public int getBalance() {
        return money;
    }
}

public class Main {
    public static void main(String[] args) {
        int start = 100;
        int income = 50;
        int spend1 = 30;
        int spend2 = 200;

        Wallet w = new Wallet(start);
        w.addMoney(income);
        w.spendMoney(spend1);
        w.spendMoney(spend2);
        System.out.println(w.getBalance());
    }
}
```
