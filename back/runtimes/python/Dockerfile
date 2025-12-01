FROM python:3.10-slim

# Crează user non-root
RUN useradd -m codeuser

# Setează directorul de lucru în runtime Python
WORKDIR /usr/src/app

# Copiază Flask app și run_code.sh
COPY app.py ./
COPY run_code.sh ./


# Permisiuni
RUN chmod +x run_code.sh

# Folosește user non-root
USER codeuser


# Comanda default: rulează serverul Flask
CMD ["python3", "user_code.py"]
