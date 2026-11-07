```bash
mv intrari/*.log jurnale/
mv intrari/*.conf config/
grep -r CRITICAL jurnale > rapoarte/probleme-critice.txt
cat config/*.conf | sort > rapoarte/config-sortat.txt
chmod 600 config/securitate.conf
date > rapoarte/rezumat-misiune.txt
echo "Stare: complet" >> rapoarte/rezumat-misiune.txt
cat rapoarte/probleme-critice.txt
```
