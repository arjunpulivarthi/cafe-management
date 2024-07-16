web: python app.py
# Development
dev: flask run --host=0.0.0.0 --port=5000

# Production using gunicorn
web: gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app:app
