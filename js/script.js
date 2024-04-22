"use strict"; // Строгий режим
(async () => { // Анонимная функция
	const discord = await fetchData("https://discord.com/api/guilds/766538286214283265/widget.json"); // Запрос данных с Discord
	restoreInfo("discordMembers", discord?.members?.length); // Прорисовка количество участников в HTML дереве
	restoreInfo("discordChannels", discord?.channels?.length); // Прорисовка количество каналов в HTML дереве
	const githubLS = checkLocalStorage("github"); // Получение данных с LocalStorage
	if (!githubLS || (githubLS?.created - new Date().getTime() / 1000) >= toHours(3)) {// Проверяем, если в LocalStorage нет данных или время с момента их создания больше трех часов, то выполняем запрос к GitHub API для получения свежих данных
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
	document.getElementById("enb").addEventListener("click", (event) => { // Добавляем обработчик нажатий на Footer-Текст
	    const redirectToOldWeb = confirm("Открыть новую вкладку?"); // Спрашиваем, как открыть ссылку
	    redirectToOldWeb ? window.open("https://kredwi.ru", "_blank") : window.open("https://kredwi.ru", "_self"); // Открываем ссылку
	})
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
		video3: "https://youtu.be/lZJOzJVdaU4"
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
		default:
			throw new Error("Error rederection");
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