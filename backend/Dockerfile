# ---- builder ----
FROM python:3.11-slim AS builder

WORKDIR /app

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- final ----
FROM python:3.11-slim AS final

WORKDIR /app

COPY --from=builder /install /usr/local
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
