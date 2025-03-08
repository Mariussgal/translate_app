FROM python:3.10-slim

WORKDIR /app

COPY backend/simple_app.py /app/
COPY backend/requirements.txt /app/

RUN pip install --no-cache-dir flask gunicorn

ENV PORT=8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "simple_app:app"]