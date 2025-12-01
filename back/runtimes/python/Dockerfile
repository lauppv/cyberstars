FROM python:3.10-slim

# Crează user non-root
RUN useradd -m codeuser

# Setează directorul de lucru în runtime Python
WORKDIR /usr/src/app

# Copiază Flask app și run_code.sh
COPY app.py ./
COPY run_code.sh ./

# Instalează Flask
RUN pip install flask

# Permisiuni
RUN chmod +x run_code.sh

# Folosește user non-root
USER codeuser

# Expune portul 5000
EXPOSE 5000


# Comanda default: rulează serverul Flask
CMD ["python3", "app.py"]
