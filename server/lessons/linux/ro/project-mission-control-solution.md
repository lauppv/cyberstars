```bash
mv intrari/*.log jurnale/
mv intrari/*.conf config/
grep -r CRITICAL jurnale/ > rapoarte/probleme-critice.txt
cat config/*.conf | sort > rapoarte/config-sortat.txt
chmod 600 config/securitate.conf
date > rapoarte/rezumat-misiune.txt
echo "Stare: complet" >> rapoarte/rezumat-misiune.txt
ls rapoarte/
```

```text
config-sortat.txt  probleme-critice.txt  rezumat-misiune.txt
```

`rapoarte/probleme-critice.txt` contine acum:

```text
jurnale/reactor.log:[CRITICAL] Reactor supraincalzit - actiune imediata necesara
jurnale/navigatie.log:[CRITICAL] Dezaliniere detectata in matricea de navigatie
```

`rapoarte/config-sortat.txt` contine acum:

```text
access_level=restricted
auth_method=biometric
bandwidth=1000Mbps
co2_scrubber=active
dns=10.0.0.2
encryption=AES256
firewall=enabled
gateway=10.0.0.1
humidity=45%
oxygen_target=21%
protocol=TCP
temperature=22C
```

`rapoarte/rezumat-misiune.txt` contine acum:

```text
Mon Jan 12 10:00:00 UTC 2026
Stare: complet
```
