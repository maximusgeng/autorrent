document.addEventListener("DOMContentLoaded", () => {
    // Проверка прав администратора
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        alert("Доступ запрещен. Требуются права администратора.");
        window.location.href = "index.html";
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders") || "[]");
    let cars = JSON.parse(localStorage.getItem("cars") || "[]");
    const container = document.getElementById("requests");

    
});
    function saveAndRender() {
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.setItem("cars", JSON.stringify(cars));
        render();
        
        // Обновляем страницу автомобилей, если она открыта
        if (window.opener && !window.opener.closed) {
            window.opener.location.reload();
        }
    }

    function render() {
        container.innerHTML = "";
        
        if (orders.length === 0) {
            container.innerHTML = "<p>Нет заявок на рассмотрении</p>";
            return;
        }

        orders.forEach((order, index) => {
            const div = document.createElement("div");
            div.className = "request-card";
            div.innerHTML = `
                <h3>Заявка #${index + 1}</h3>
                <div class="order-info">
                    <p><strong>Автомобиль:</strong> ${order.carModel}</p>
                    <p><strong>Клиент:</strong> ${order.passport}</p>
                    <p><strong>Срок аренды:</strong> ${order.days} дней</p>
                    <p><strong>Статус:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Дата подачи:</strong> ${new Date(order.submittedAt).toLocaleString()}</p>
                    ${order.reason ? `<p><strong>Причина отказа:</strong> ${order.reason}</p>` : ''}
                </div>
                ${order.status === "Ожидает подтверждения" ? `
                <div class="admin-actions">
                    <button class="approve-btn" onclick="approve(${index})">Подтвердить</button>
                    <button class="reject-btn" onclick="reject(${index})">Отклонить</button>
                    <input type="text" id="reason-${index}" placeholder="Причина отказа" class="reason-input">
                </div>
                ` : ''}
            `;
            container.appendChild(div);
        });
    }

    window.approve = (index) => {
        orders[index].status = "Подтвержден";
        
        // Обновляем статус автомобиля
        const carIndex = cars.findIndex(car => car.name === orders[index].carModel);
        
        if (carIndex !== -1) {
            cars[carIndex].status = "Недоступен";
            cars[carIndex].availableAt = orders[index].availableAt;
        }
        
        saveAndRender();
    };

    window.reject = (index) => {
        const reasonInput = document.getElementById(`reason-${index}`);
        const reason = reasonInput.value.trim() || "Причина не указана";
        
        orders[index].status = "Отклонен";
        orders[index].reason = reason;

        // Освобождаем автомобиль
        const carIndex = cars.findIndex(car => car.name === orders[index].carModel);
        if (carIndex !== -1) {
            cars[carIndex].status = "Доступен";
            cars[carIndex].availableAt = null;
        }

        saveAndRender();
    };

    render();
});