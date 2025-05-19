document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCar = urlParams.get('car');
    
    const cars = JSON.parse(localStorage.getItem("cars") || "[]");
    const select = document.getElementById("car-select");
    const form = document.getElementById("rental-form");
    const message = document.createElement("div");
    message.className = "message";
    form.parentNode.insertBefore(message, form.nextSibling);

    // Заполнение списка только доступными автомобилями
    cars.forEach((car, index) => {
        if (car.status === "Доступен") {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = car.name;
            select.appendChild(option);
        }
    });

    // Автовыбор автомобиля из параметра URL
    if (selectedCar) {
        const carIndex = cars.findIndex(car => car.name === selectedCar);
        if (carIndex !== -1 && cars[carIndex].status === "Доступен") {
            select.value = carIndex;
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const carIndex = select.value;
        const passport = localStorage.getItem("currentUser");
        const duration = parseInt(document.getElementById("duration").value);

        // Проверка данных
        if (!passport || !duration || isNaN(duration) || duration < 1) {
            message.textContent = "Пожалуйста, заполните все поля корректно!";
            message.style.color = "red";
            return;
        }

        const now = new Date();
        const returnDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

        // Обновляем статус автомобиля
        cars[carIndex].status = "Забронирован";
        cars[carIndex].availableAt = returnDate.toISOString();
        localStorage.setItem("cars", JSON.stringify(cars));

        // Создаем заявку
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push({
            carModel: cars[carIndex].name,
            passport,
            days: duration,
            status: "Ожидает подтверждения",
            submittedAt: now.toISOString(),
            availableAt: returnDate.toISOString(),
            reason: ""
        });
        localStorage.setItem("orders", JSON.stringify(orders));

        message.textContent = "Заявка отправлена! Ожидайте подтверждения.";
        message.style.color = "green";
        form.reset();

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 2000);
    });

    // Проверка авторизации
    const user = localStorage.getItem("currentUser");
    if (!user) {
        alert("Для оформления аренды необходимо авторизоваться");
        window.location.href = "login.html";
    }
});