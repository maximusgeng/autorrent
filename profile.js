document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("currentUser");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const container = document.getElementById("user-orders");

    // Фильтруем заказы текущего пользователя
    const userOrders = user ? orders.filter(order => order.passport === user) : [];

    if (!user) {
        container.innerHTML = "<p class='error'>Для просмотра заказов необходимо авторизоваться</p>";
        setTimeout(() => window.location.href = "login.html", 2000);
        return;
    }

    if (userOrders.length === 0) {
        container.innerHTML = "<p>У вас нет активных заказов</p>";
        return;
    }

    userOrders.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";
        div.innerHTML = `
            <h3>${order.carModel}</h3>
            <div class="order-details">
                <p><strong>Статус:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                <p><strong>Срок аренды:</strong> ${order.days} дней</p>
                <p><strong>Дата оформления:</strong> ${new Date(order.submittedAt).toLocaleString()}</p>
                <p><strong>Дата возврата:</strong> ${new Date(order.availableAt).toLocaleString()}</p>
                ${order.reason ? `<p><strong>Причина отказа:</strong> ${order.reason}</p>` : ''}
            </div>
        `;
        container.appendChild(div);
    });
});