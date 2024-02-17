document.getElementById("goalType").addEventListener("change", function() {
    toggleGoalInput();
});

function toggleGoalInput() {
    const goalType = document.getElementById("goalType").value;
    if (goalType === "date") {
        document.getElementById("endDateGroup").style.display = "block";
        document.getElementById("durationGroup").style.display = "none";
    } else {
        document.getElementById("endDateGroup").style.display = "none";
        document.getElementById("durationGroup").style.display = "block";
    }
}

document.getElementById("calculate").addEventListener("click", function() {
    const startDateValue = document.getElementById("startDate").value;
    const goalType = document.getElementById("goalType").value;
    let endDate;

    if (!startDateValue) {
        document.getElementById("result").innerHTML = `<span style="color: red;">Пожалуйста, введите дату начала.</span>`;
        document.getElementById("progressBar").style.width = `0%`;
        return; // Прекращаем выполнение функции, если дата начала не введена
    }

    const startDate = new Date(startDateValue);

    if (goalType === "date") {
        const endDateValue = document.getElementById("endDate").value;
        if (!endDateValue) {
            document.getElementById("result").innerHTML = `<span style="color: red;">Пожалуйста, введите дату окончания.</span>`;
            document.getElementById("progressBar").style.width = `0%`;
            return; // Прекращаем выполнение функции, если дата окончания не введена
        }
        endDate = new Date(endDateValue);
    } else {
        endDate = calculateEndDateBasedOnDuration(startDate);
        if (isNaN(endDate)) {
            document.getElementById("result").innerHTML = `<span style="color: red;">Пожалуйста, проверьте введенную продолжительность.</span>`;
            document.getElementById("progressBar").style.width = `0%`;
            return; // Прекращаем выполнение функции, если продолжительность некорректна
        }
    }

    // Убедитесь, что дата окончания позже даты начала
    if (endDate <= startDate) {
        document.getElementById("result").innerHTML = `<span style="color: red;">Дата окончания должна быть позже даты начала.</span>`;
        document.getElementById("progressBar").style.width = `0%`;
        return;
    }

    updateProgressBar(startDate, endDate);
});


function calculateEndDateBasedOnDuration(startDate) {
    const durationValue = parseInt(document.getElementById("durationValue").value, 10);
    const durationUnit = document.getElementById("durationUnit").value;
    const endDate = new Date(startDate);

    switch (durationUnit) {
        case "days":
            endDate.setDate(startDate.getDate() + durationValue);
            break;
        case "weeks":
            endDate.setDate(startDate.getDate() + durationValue * 7);
            break;
        case "months":
            endDate.setMonth(startDate.getMonth() + durationValue);
            break;
        case "years":
            endDate.setFullYear(startDate.getFullYear() + durationValue);
            break;
    }

    return endDate;
}

function updateProgressBar(startDate, endDate) {
    const currentDate = new Date();
    const totalTime = endDate - startDate;
    const elapsedTime = currentDate - startDate;
    const progressPercentage = Math.min((elapsedTime / totalTime) * 100, 100);

    const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    const remainingTime = endDate - currentDate;
    const remainingDays = Math.max(Math.floor(remainingTime / (1000 * 60 * 60 * 24)), 0);

    document.getElementById("progressBar").style.width = `${progressPercentage}%`;
    document.getElementById("result").innerHTML = `
        Прошло времени: ${progressPercentage.toFixed(2)}%.<br>
        Это составляет: ${formatRemainingTime(elapsedDays)}.<br>
        Осталось дней: ${formatRemainingTime(remainingDays)}.
    `;
}


function formatRemainingTime(days) {
    const years = Math.floor(days / 365);
    days -= years * 365;
    const months = Math.floor(days / 30);
    days -= months * 30;
    const weeks = Math.floor(days / 7);
    days -= weeks * 7;

    let result = [];
    if (years > 0) result.push(`${years} ${years === 1 ? 'год' : 'лет'}`);
    if (months > 0) result.push(`${months} ${months === 1 ? 'месяц' : 'месяцев'}`);
    if (weeks > 0) result.push(`${weeks} ${weeks === 1 ? 'неделя' : 'недель'}`);
    if (days > 0) result.push(`${days} ${days === 1 ? 'день' : 'дней'}`);

    return result.length > 0 ? result.join(', ') : '0 дней';
}