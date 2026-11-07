```bash
mkdir deck-office
cut -d, -f1 manifest.csv > deck-office/item-list.txt
cut -d, -f1,3 manifest.csv > deck-office/destinations.txt
cat deck-office/destinations.txt
```

```text
oxygen_tanks,deck1
ration_packs,deck3
medkits,medbay
batteries,engineering
water_filters,life_support
```
