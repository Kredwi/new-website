"use strict"; // Строгий режим

const header = document.getElementById("header"); // Получаем id header страницы
const videoBlock = document.getElementById("videos-block");

(async () => { // Анонимная функция
  discordFetch();
	githubFetch();
	document.getElementById("enb").addEventListener("click", () => { // Добавляем обработчик нажатий на Footer-Текст
	    const redirectToOldWeb = confirm("Открыть новую вкладку?"); // Спрашиваем, как открыть ссылку
	    redirectToOldWeb ? window.open("https://kredwi.ru", "_blank") : window.open("https://kredwi.ru", "_self"); // Открываем ссылку
	});
})();
async function discordFetch() {
  const discordElement = document.getElementById("discord");
  try {
    const discord = await fetchData("https://discord.com/api/guilds/766538286214283265/widget.json"); // Запрос данных с Discord
      if (discord == undefined) {
    console.error("error loading data from discord. Check your Ethernet connection.");
    createNotification("warn", "Данные с Discord не были скачаны из-за ошибки", "Раздел с Discord скрыт.");
    return;
  }
restoreInfo("discordMembers", discord?.members?.length); // Прорисовка количество участников в HTML дереве каналов в HTML дереве
discordElement.removeAttribute("hidden");  
  } catch (e) {
    discordElement.setAttribute("hidden", "hidden");
  }
}
async function githubFetch() {
  const githubLS = checkLocalStorage("github"); // Получение данных с LocalStorage
if (!githubLS || (new Date().getTime() / 1000) - githubLS?.created >= toHours(3)) { // Проверяем, если в LocalStorage нет данных или время с момента их создания больше трех часов, то выполняем запрос к GitHub API для получения свежих данных
  const github = await fetchData("https://api.github.com/users/kredwi"); // Запрос данных с GitHub
  if (github == undefined) {
    console.error("error loading data from github");
    return;
  }
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
}

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
		return undefined;
	}
}
// Функция для открытия ссылки на видео/YouTube канал при клике на кнопку
function redirect(e) {
	const url = {
		channel: "https://www.youtube.com/channel/UCH-f_szwD2msRXhwMmePeiA",
		video1: "https://youtu.be/wb9SfsxcWHw",
		video2: "https://youtu.be/pgMv4uEAWSM",
		video3: "https://youtu.be/lZJOzJVdaU4",
		video5: "https://m.youtube.com/watch?v=AFyfXrOuZX0",
		video6: "https://m.youtube.com/watch?v=W4ZnoE_YE3A",
		video7: "https://m.youtube.com/watch?v=-XfR1PO4lyw",
		video8: "https://kredwi.ru"
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
		case 5:
			window.open(url.video5, "_blank");
			break;
		case 6:
			window.open(url.video6, "_blank");
		break;
		case 7:
			window.open(url.video7, "_blank");
		case 8:
			window.open(url.video8, "_blank");
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
	if (!type || !title || !title.length) return console.error("Please, fill all fields"); // Выводим ошибку, если заполнены не все данные
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
createNotification("alert", "Новый дизайн на kredwi.ru!", "Kredwi изменил дизайн kredwi.ru", "Перейти", "redirect(8)");

function addVideo(info) {
	const template = `<div class="video">
				<h4 class="video-name"><a class="video-name" href="${info.url}">${info.name.toLowerCase()}</a></h4>
				<img class="video-preview" alt="Наверное стоит включить средство обхода..." src="${info.preview}">
				<span class="video-category">Категория: <span>${info.category}</span></span>
				<hr>
				<p class="video-description">${info.description}</p>
				<button title="Перейти на страницу видео" class="video-check" onclick="${info.action}">Смотреть</button>
			</div>`;
			videoBlock.innerHTML += template;
}

function clearAllVideos() {
	videoBlock.innerHTML = "";
}

function mainChannel() {
	clearAllVideos();
	addVideo({
    name: "Где скачивать моды?",
    url: "https://youtu.be/wb9SfsxcWHw",
    preview: "img/previews/hdmi.jpg",
    category: "Туториал",
    description: "В этом видео, я вам расскажу про то, какие сайты использовал каждый, для того что бы скачивать моды в Майнкрафт. Все мы любим играть с модами, но у нас всегда появляется вопрос. Где скачать безопасно моды? В этом видео я про это расскажу.",
    action: "redirect(1)"
});

addVideo({
    name: "ЧТО СТРОИТ ЭТОТ ГЕНИЙ?! | BUILDBATTLE в Minecraft",
    url: "https://youtu.be/pgMv4uEAWSM",
    preview: "img/previews/bbinm.jpg",
    category: "BuildBattle",
    description: "Что строит этот гений?  Этот гений строит Постройку которую я не могу описать в описании, он слишком гениален что бы понять что эта постройка не похоже на то что нам нужно. Когда нибудь он поймет что надо было строить вот это а не это. А вот что он строил узнаете в ролике. Приятного просмотра.",
    action: "redirect(2)"
});

addVideo({
    name: "ЭТО НЕ ПРОСТО СНАЙПЕР?? ДА ЭТО ЧИТЕР!!!! | Снайперы в Minecraft",
    url: "https://youtu.be/lZJOzJVdaU4",
    preview: "img/previews/sinm.jpg",
    category: "Снайперы",
    description: "Этот Читер был настолько силен, что мне пришлось использовать секретное оружие, я не знал поможет ли мне оно? Он хотел победить, но он не знал что я использовал секретное оружие, а вот что за секретное оружие узнайте в ролике. Удачного просмотра!",
    action: "redirect(3)"
});
}

function secondChannel() {
clearAllVideos();
addVideo({
	name: "Какой там цвет? Блин! Block Party на The Hive.",
	url: "https://m.youtube.com/watch?v=AFyfXrOuZX0",
	preview: "img/previews/bpinm.jpg",
	category: "BlockParty",
	description: "Просто обычная игра в BlockParty на сервере <b>The Hive MC</b>. Видео снималось в целях проверки оптимизации Minecraft: Bedrock Edition",
	action: "redirect(5)"
});
addVideo({
	name: "Видео прямиком из 2010 года.... #42",
	url: "https://m.youtube.com/watch?v=W4ZnoE_YE3A",
	preview: "img/previews/mmimh.jpg",
	category: "MurderMystery",
	description: "Неудачное видео про то, как я играл в Murder Mystery на сервер <b>Hypixel</b>. После записи я увидел файл лога, который весил очень много.",
	action: "redirect(6)"
});
addVideo({
	name: "ХАЙПИКСЕЛЬ ВТИРАЕТ КАКУЮ-ТО ДИЧЬ! Hypixel Says",
	url: "https://m.youtube.com/watch?v=-XfR1PO4lyw",
	preview: "img/previews/hsinmh.jpg",
	category: "HypixelSays",
	description: "Обычная игра в режим Hypixel Says на сервере <b>Hypixel</b>.Толком не смог записать, игроков тупо не было.",
	action: "redirect(7)"
});
}

mainChannel();

