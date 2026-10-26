const { zokou } = require("../framework/zokou");
const conf = require("../set");
const axios = require("axios");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : SEARCH & INFO COMMANDS
// ═══════════════════════════════════════════════

// 1. WIKIPEDIA (Search Wikipedia)
zokou({
    nomCom: "wiki",
    categorie: "Search",
    reaction: "📚",
    desc: "Search information on Wikipedia",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!arg[0]) return repondre("❌ *Please provide a search query!*\nExample: .wiki Albert Einstein");

    const query = arg.join(" ");
    await repondre("⏳ *Searching Wikipedia...*");

    try {
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        
        if (res.data.type === "disambiguation" || !res.data.extract) {
            return repondre("❌ *No clear results found. Try a more specific search.*");
        }

        let text = `📚 *WIKIPEDIA: ${res.data.title}*\n\n`;
        text += `${res.data.extract}\n\n`;
        if (res.data.content_urls) text += `🔗 *Read more:* ${res.data.content_urls.desktop.page}`;

        await repondre(text);
    } catch (e) {
        await repondre("❌ *Failed to fetch data from Wikipedia.*");
    }
});

// 2. GITHUB (Search GitHub User)
zokou({
    nomCom: "github",
    categorie: "Search",
    reaction: "🐙",
    desc: "Search GitHub user profile",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!arg[0]) return repondre("❌ *Please provide a GitHub username!*\nExample: .github torvalds");

    const username = arg[0];
    await repondre("⏳ *Fetching GitHub profile...*");

    try {
        const res = await axios.get(`https://api.github.com/users/${username}`);
        const user = res.data;

        let text = `🐙 *GITHUB PROFILE*\n\n`;
        text += `👤 *Name:* ${user.name || "N/A"}\n`;
        text += `🔗 *Username:* @${user.login}\n`;
        text += `📝 *Bio:* ${user.bio || "No bio"}\n`;
        text += `📦 *Public Repos:* ${user.public_repos}\n`;
        text += `👥 *Followers:* ${user.followers}\n`;
        text += `👣 *Following:* ${user.following}\n`;
        text += `📍 *Location:* ${user.location || "N/A"}\n`;
        text += `🔗 *Profile:* ${user.html_url}`;

        await client.sendMessage(dest, { image: { url: user.avatar_url }, caption: text }, { quoted: cmd.ms });
    } catch (e) {
        await repondre("❌ *GitHub user not found.*");
    }
});

// 3. MOVIE (Search Movie Info)
zokou({
    nomCom: "movie",
    categorie: "Search",
    reaction: "🎬",
    desc: "Search movie or series information",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!arg[0]) return repondre("❌ *Please provide a movie name!*\nExample: .movie Inception");

    const query = arg.join(" ");
    await repondre("⏳ *Searching movie database...*");

    try {
        // Using OMDB API (You need a free API key from omdbapi.com, I used a default one)
        const res = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=trilogy`);
        const data = res.data;

        if (data.Response === "False") return repondre("❌ *Movie not found!*");

        let text = `🎬 *MOVIE INFO*\n\n`;
        text += `📛 *Title:* ${data.Title}\n`;
        text += `📅 *Year:* ${data.Year}\n`;
        text += `⏱️ *Runtime:* ${data.Runtime}\n`;
        text += `⭐ *Rating:* ${data.imdbRating}\n`;
        text += `🎭 *Genre:* ${data.Genre}\n`;
        text += `🎬 *Director:* ${data.Director}\n`;
        text += `👨‍🎤 *Actors:* ${data.Actors}\n\n`;
        text += `📝 *Plot:* ${data.Plot}`;

        await client.sendMessage(dest, { image: { url: data.Poster !== "N/A" ? data.Poster : conf.URL }, caption: text }, { quoted: cmd.ms });
    } catch (e) {
        await repondre("❌ *Failed to fetch movie info.*");
    }
});

// 4. WEATHER (Get Weather Info)
zokou({
    nomCom: "weather",
    categorie: "Search",
    reaction: "🌤️",
    desc: "Get weather information for a city",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!arg[0]) return repondre("❌ *Please provide a city name!*\nExample: .weather Dar es Salaam");

    const city = arg.join(" ");
    await repondre("⏳ *Fetching weather data...*");

    try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const cur = res.data.current_condition[0];

        let text = `🌤️ *WEATHER IN ${city.toUpperCase()}*\n\n`;
        text += `🌡️ *Temperature:* ${cur.temp_C}°C\n`;
        text += `🤔 *Feels Like:* ${cur.FeelsLikeC}°C\n`;
        text += `☁️ *Condition:* ${cur.weatherDesc[0].value}\n`;
        text += `💧 *Humidity:* ${cur.humidity}%\n`;
        text += `💨 *Wind:* ${cur.windspeedKmph} km/h\n`;
        text += `👁️ *Visibility:* ${cur.visibility} km\n`;
        text += `🔆 *UV Index:* ${cur.uvIndex}`;

        await repondre(text);
    } catch (e) {
        await repondre("❌ *City not found or service unavailable.*");
    }
});

// 5. SCREENSHOT (Take Website Screenshot)
zokou({
    nomCom: "ss",
    categorie: "Search",
    reaction: "📸",
    desc: "Take a screenshot of a website",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;

    if (!arg[0] || !arg[0].startsWith("http")) {
        return repondre("❌ *Provide a valid URL starting with http/https!*\nExample: .ss https://google.com");
    }

    const url = arg[0];
    await repondre("⏳ *Taking screenshot...*");

    try {
        const ssUrl = `https://api.screenshotmachine.com/?key=d34c20&url=${encodeURIComponent(url)}&device=desktop&dimension=1280x720&format=png`;
        
        await client.sendMessage(dest, { image: { url: ssUrl }, caption: `📸 *Screenshot of:* ${url}` }, { quoted: cmd.ms });
    } catch (e) {
        await repondre("❌ *Failed to take screenshot. Check the URL.*");
    }
});
