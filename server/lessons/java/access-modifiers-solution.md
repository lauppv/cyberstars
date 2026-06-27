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
        Wallet w = new Wallet(100);
        w.addMoney(50);
        w.spendMoney(30);
        w.spendMoney(200);
        System.out.println(w.getBalance());
    }
}
```
