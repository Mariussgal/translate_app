FROM python:3.10-slim

WORKDIR /app

COPY backend/ /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "api:app"]