"use strict";
(async () => {
	const discord = await fetchData("https://discord.com/api/guilds/766538286214283265/widget.json");
	restoreInfo("discordMembers", discord?.members?.length);
	restoreInfo("discordChannels", discord?.channels?.length);
	const githubLS = checkLocalStorage("github");
	const github = await fetchData("https://api.github.com/users/kredwi");
	if (github?.public_repos == undefined) {
		restoreInfo("githubRepos", githubLS?.public_repos || 0);
		restoreInfo("githubFollowing", githubLS?.followers || 0);
		restoreInfo("githubFollowing", githubLS?.following || 0);
		console.log("GitHub loaded old information from localStorage. Created (UNIX): " + (githubLS?.created || "Not Found"))
	} else {
		restoreInfo("githubRepos", github?.public_repos || 0);
		restoreInfo("githubFollowing", github?.followers || 0);
		restoreInfo("githubFollowing", github?.following || 0);
		localStorage.setItem("github", JSON.stringify({
			public_repos: github?.public_repos || 0, 
			followers: github?.followers || 0, 
			following: github?.following || 0, 
			created: new Date().getTime()
		}));
	}
	document.getElementById("enb").addEventListener("click", (event) => {
	    const redirectToOldWeb = confirm("Открыть новую вкладку?");
	    redirectToOldWeb ? window.open("https://kredwi.ru", "_blank") : window.open("https://kredwi.ru", "_self");
	})
})();
function restoreInfo(id, number) {
	document.getElementById(id).innerHTML = number;
}
async function fetchData(u, b) {
	try {
		const response = await fetch(u);
		return await response.json();
	} catch (error) {
		console.error(error)
	}
}
function redirect(e) {
	const url = {
		channel: "https://www.youtube.com/channel/UCH-f_szwD2msRXhwMmePeiA",
		video1: "https://youtu.be/wb9SfsxcWHw",
		video2: "https://youtu.be/pgMv4uEAWSM",
		video3: "https://youtu.be/lZJOzJVdaU4"
	}
	switch (e) {
		case 1:
			window.open(url.channel, "_blank");
			break;
		case 2:
			window.open(url.channel, "_blank");
			break;
		case 3:
			window.open(url.channel, "_blank");
			break;
		default:
			throw new Error("Error rederection");
	}
}
function truncateText(text, length) {
	if (text.length > length) return text.substring(0, length).trim() + "...";
	else return text;
}
function checkLocalStorage(n) {
	return JSON.parse(localStorage.getItem(n));
}
function toHours(h) {
	return h * 60 * 60 * 1000;
}