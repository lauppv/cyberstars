```bash
sort -r supplies.txt
sort -r supplies.txt > unload-order.txt
mkdir cargo-bay
mv unload-order.txt cargo-bay/
head -n 1 cargo-bay/unload-order.txt
```

```text
water filters
ration packs
oxygen tanks
medkits
batteries
ammo crates
water filters
```
