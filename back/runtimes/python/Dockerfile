# FROM imaginea actuală
FROM python:3.10-slim

# Crează un user non-root
RUN useradd -m codeuser

# Setează directorul de lucru
WORKDIR /usr/src/app

# Copiază scriptul
COPY run_code.sh ./

# Dă permisiuni
RUN chmod +x run_code.sh

# Schimbă user-ul curent la codeuser
USER codeuser

# Comanda implicită
CMD ["./run_code.sh", "user_code.py"]
