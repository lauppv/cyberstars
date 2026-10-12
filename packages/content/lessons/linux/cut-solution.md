```bash
cut -d, -f1 manifest.csv
cut -d, -f1 manifest.csv > item-list.txt
mkdir deck-office
mv item-list.txt deck-office/
wc -l deck-office/item-list.txt
```

```text
oxygen_tanks
ration_packs
medkits
batteries
water_filters
5 deck-office/item-list.txt
```
