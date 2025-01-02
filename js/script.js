"use strict"; // Строгий режим

const header = document.getElementById("header"); // Получаем id header страницы

(async () => { // Анонимная функция
	const discord = await fetchData("https://discord.com/api/guilds/766538286214283265/widget.json"); // Запрос данных с Discord
	restoreInfo("discordMembers", discord?.members?.length); // Прорисовка количество участников в HTML дереве
	restoreInfo("discordChannels", discord?.channels?.length); // Прорисовка количество каналов в HTML дереве
	const githubLS = checkLocalStorage("github"); // Получение данных с LocalStorage
	if (!githubLS || (new Date().getTime() / 1000) - githubLS?.created >= toHours(3)) { // Проверяем, если в LocalStorage нет данных или время с момента их создания больше трех часов, то выполняем запрос к GitHub API для получения свежих данных
		const github = await fetchData("https://api.github.com/users/kredwi"); // Запрос данных с GitHub
		restoreInfo("githubRepos", github?.public_repos || 0); // Прорисовка количество репозиторий в HTML дереве
		restoreInfo("githubFollowing", github?.followers || 0); // Прорисовка количество фолловеров в HTML дереве
		restoreInfo("githubFollowing", github?.following || 0); // Прорисовка количество подписок в HTML дереве
		localStorage.setItem("github", JSON.stringify({ // Сохранение ифнормации в LocalStorage в JSON формате
			public_repos: github?.public_repos || 0, 
			followers: github?.followers || 0, 
			following: github?.following || 0, 
			created: Math.floor(new Date().getTime() / 1000) // Получаем UNIX время (секунды)
		}));
	} else {
		restoreInfo("githubRepos", githubLS?.public_repos || 0); // Прорисовка количество репозиторий в HTML дереве
		restoreInfo("githubFollowing", githubLS?.followers || 0); // Прорисовка количество фолловеров в HTML дереве
		restoreInfo("githubFollowing", githubLS?.following || 0); // Прорисовка количество подписок в HTML дереве
		console.log("GitHub loaded old information from localStorage. Created (UNIX): " + (githubLS?.created || "Not Found"));
	}
	document.getElementById("enb").addEventListener("click", () => { // Добавляем обработчик нажатий на Footer-Текст
	    const redirectToOldWeb = confirm("Открыть новую вкладку?"); // Спрашиваем, как открыть ссылку
	    redirectToOldWeb ? window.open("https://kredwi.ru", "_blank") : window.open("https://kredwi.ru", "_self"); // Открываем ссылку
	});
})();
// Функция для изменения значения в HTML-дереве
function restoreInfo(id, number) {
	document.getElementById(id).innerHTML = number; // Меняем значение в HTML дереве
}
// Функция для получения данных с сервера
async function fetchData(u, b) {
	try {
		const response = await fetch(u);
		return await response.json();
	} catch (error) {
		console.error(error);
	}
}
// Функция для открытия ссылки на видео/YouTube канал при клике на кнопку
function redirect(e) {
	const url = {
		channel: "https://www.youtube.com/channel/UCH-f_szwD2msRXhwMmePeiA",
		video1: "https://youtu.be/wb9SfsxcWHw",
		video2: "https://youtu.be/pgMv4uEAWSM",
		video3: "https://youtu.be/lZJOzJVdaU4",
		video4: "https://www.youtube.com/shorts/UK7DKkY6YlY",
		newsite: "https://www.youtube.com/shorts/UK7DKkY6YlY"
	}
	switch (e) {
		case 1:
			window.open(url.video1, "_blank");
			break;
		case 2:
			window.open(url.video2, "_blank");
			break;
		case 3:
			window.open(url.video3, "_blank");
			break;
		case 4:
			window.open(url.video4, "_blank");
			break;
		case 5:
			window.open(url.newsite, "_blank");
			break;
		default:
			throw new Error("Error redirection");
	}
}
// Функция для проверки LocalStorage (Локального хранилище)
function checkLocalStorage(n) {
	return JSON.parse(localStorage.getItem(n)); // Возращаем данные с LocalStorage, принудительно преобразовываем в JSON
}
// Функция для преобразования часов в секунды
function toHours(h) {
	return h * 60 * 60; // Возращаем часы в UNIX-времени
}
function createNotification(type, title, description = "", buttonText = "Ок", functionName = "") {
	if (
		document.getElementById("alert") || // Если на странице существует ID "alert"
		document.getElementById("error") || // Если на странице существует ID "error"
		document.getElementById("warn") // Если на странице существует ID "warn"
	) return console.warn("Alert is created"); // То в консоль выводится предупреждение, о том что уведомление уже существует
	if (!type || !title || !title.length) return console.error("Please, fill all fields"); // Выводим ошибку, если заполнены, не все данные
	switch (type.toLowerCase()) { // Получаем type, и превращаем его в нижний РеГиСтР
		case 'alert': // Если ключ равен "alert"
			header.insertAdjacentHTML("afterend", `
				<article id="alert">
					<div id="alert-text">
						<span>${title}</span>
						<p>${description}</p>
					</div>
					<button onclick="${String(functionName)}">${buttonText}</button>
				</article>
			`);
			document.getElementById("alert").addEventListener("click", () => { // Добавляем обработчик нажатий на Уведомление
				document.getElementById("alert").remove() // Удаляем уведомление
			});
			break;
		case 'warn': // Если ключ равен "warn"
			header.insertAdjacentHTML("afterend", `
				<article id="warn">
					<div id="warn-text">
						<span><span class="red">ВНИМАНИЕ: </span> ${title}</span>
						<p>${description}</p>
					</div>
				</article>
			`);
			document.getElementById("warn").addEventListener("click", () => { // Добавляем обработчик нажатий на Уведомление
				document.getElementById("warn").remove() // Удаляем уведомление
			});
			break;
		case 'error': // Если ключ равен "error"
			header.insertAdjacentHTML("afterend", `
				<article id="error">
					<div id="error-text">
						<span><span class="red">ОШИБКА: </span> ${title}</span>
						<p>${description}</p>
					</div>
				</article>
			`);
			document.getElementById("error").addEventListener("click", () => { // Добавляем обработчик нажатий на Уведомление
				document.getElementById("error").remove() // Удаляем уведомление
			});
			break;
		default:
			return console.error(`${key} not found`); // Отправляем ошибку, что данный тип уведомление не найден
	}
}
createNotification("alert", "Сайт переезжает! (28.02.2025)" , "Сайт перезжает на новый адрес, оплатить этот адрес не имеется возможности", "Перейти", "redirect(5)");
