var socket = io();
var orderNumber = 0;
var orderItems = [];

// Function to add an item to the order list when double-clicked
function addItem(itemName, itemPrice) {
    var quantity = parseInt(document.getElementById('quantity').value);
    if (quantity > 0) {
        // Check if the item is already in the order list
        var existingItem = orderItems.find(item => item.item === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;  // Update quantity
        } else {
            orderItems.push({ item: itemName, quantity: quantity, price: itemPrice });
        }
        updateOrderList();
    } else {
        alert('Please enter a valid quantity.');
    }
}

// Update the order list display
function updateOrderList() {
    var orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    orderItems.forEach((order) => {
        var listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${order.item} - Quantity: ${order.quantity} - ₹${order.price * order.quantity}`;
        orderList.appendChild(listItem);
    });
}

// Function to submit the order
function submitOrder() {
    if (orderItems.length === 0) {
        alert('No items in the order.');
        return;
    }
    orderNumber += 1;  // Increment order number for each new order
    socket.emit('order', { items: orderItems, order_number: orderNumber });
    document.getElementById('orderNumber').textContent = `Order Number: ${orderNumber}`;
    orderItems = [];
    updateOrderList();
    alert(`Order Number ${orderNumber} submitted successfully!`);
}

// Handle incoming orders from the server
socket.on('order', function(data) {
    var ordersList = document.getElementById('orders');
    if (ordersList) {
        var newItem = document.createElement('li');
        newItem.className = 'list-group-item';
        var itemsText = data.items.map(item => `${item.item} - Quantity: ${item.quantity}`).join(', ');
        newItem.textContent = `Order #${data.order_number}: ${itemsText}`;
        ordersList.appendChild(newItem);
    }
});
