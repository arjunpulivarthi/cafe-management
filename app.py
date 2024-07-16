from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
app.secret_key = 'supersecretkey'
socketio = SocketIO(app)

users = {
    "cashier": generate_password_hash("cashier_password"),
    "kitchen": generate_password_hash("kitchen_password")
}

order_counter = 1  # Initialize the order number counter

# Sample menu items with prices
menu_items = [
    {"name": "Dosa", "price": 50},
    {"name": "Idli", "price": 30},
    {"name": "Vada", "price": 40},
    {"name": "Uttapam", "price": 60},
    {"name": "Pongal", "price": 55}
]

@app.route('/')
def index():
    if 'username' in session:
        if session['username'] == 'cashier':
            return render_template('cashier.html', menu_items=menu_items)
        elif session['username'] == 'kitchen':
            return render_template('kitchen.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            return redirect(url_for('index'))
        return "Invalid username or password"
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@socketio.on('order')
def handle_order(data):
    global order_counter
    order_number = order_counter
    order_counter += 1  # Increment the order number for the next order
    data['order_number'] = order_number  # Add order number to the data
    emit('order', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000, allow_unsafe_werkzeug=True)
