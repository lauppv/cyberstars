# Dockerfile pentru C
FROM gcc:latest

# Crează un user non-root
RUN useradd -m codeuser

# Setează directorul de lucru
WORKDIR /usr/src/app

# Copiază fișierele
COPY user_code.c ./
COPY run_code.sh ./

# Dă permisiuni scriptului
RUN chmod +x run_code.sh

# Asigură-te că codeuser are drepturi asupra directorului
RUN chown -R codeuser:codeuser /usr/src/app

# Schimbă user-ul curent la codeuser
USER codeuser

# Comanda implicită
CMD ["./run_code.sh", "user_code.c"]
