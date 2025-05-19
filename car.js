document.addEventListener("DOMContentLoaded", () => {
    const cars = JSON.parse(localStorage.getItem("cars") || "[]");
    const container = document.getElementById("car-list");

    if (cars.length === 0) {
        container.innerHTML = "<p>Нет доступных автомобилей.</p>";
        return;
    }

    cars.forEach(car => {
        const div = document.createElement("div");
        const availableTime = car.availableAt ? new Date(car.availableAt).toLocaleString() : "Сейчас";
        div.innerHTML = `
            <h3>${car.model}</h3>
            <p>Статус: ${car.status}</p>
            <p>Доступен через: ${availableTime}</p>
        `;
        container.appendChild(div);
    });
});
