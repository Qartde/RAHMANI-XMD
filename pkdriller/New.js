//topu tech
const {
  zokou
} = require("../framework/zokou");
const capitalGame = [{
  'country': "Afghanistan",
  'capital': 'Kabul'
}, {
  'country': 'Albania',
  'capital': 'Tirana'
}, {
  'country': "Algeria",
  'capital': 'Algiers'
}, {
  'country': "Andorra",
  'capital': "Andorra la Vella"
}, {
  'country': "Angola",
  'capital': "Luanda"
}, {
  'country': "Antigua and Barbuda",
  'capital': "Saint John's"
}, {
  'country': "Argentina",
  'capital': "Buenos Aires"
}, {
  'country': "Armenia",
  'capital': "Yerevan"
}, {
  'country': "Australia",
  'capital': 'Canberra'
}, {
  'country': "Austria",
  'capital': "Vienna"
}, {
  'country': "Azerbaijan",
  'capital': "Baku"
}, {
  'country': "Bahamas",
  'capital': 'Nassau'
}, {
  'country': "Bahrain",
  'capital': "Manama"
}, {
  'country': "Bangladesh",
  'capital': 'Dhaka'
}, {
  'country': "Barbados",
  'capital': 'Bridgetown'
}, {
  'country': 'Belarus',
  'capital': 'Minsk'
}, {
  'country': "Belgium",
  'capital': 'Brussels'
}, {
  'country': "Belize",
  'capital': "Belmopan"
}, {
  'country': "Benin",
  'capital': "Porto-Novo"
}, {
  'country': "Bhutan",
  'capital': "Thimphu"
}, {
  'country': "Bolivia",
  'capital': 'Sucre'
}, {
  'country': "Bosnia and Herzegovina",
  'capital': "Sarajevo"
}, {
  'country': 'Botswana',
  'capital': 'Gaborone'
}, {
  'country': 'Brazil',
  'capital': 'Brasília'
}, {
  'country': "Brunei",
  'capital': "Bandar Seri Begawan"
}, {
  'country': 'Bulgaria',
  'capital': "Sofia"
}, {
  'country': "Burkina Faso",
  'capital': 'Ouagadougou'
}, {
  'country': "Burundi",
  'capital': "Gitega"
}, {
  'country': "Cabo Verde",
  'capital': 'Praia'
}, {
  'country': "Cambodia",
  'capital': "Phnom Penh"
}, {
  'country': "Cameroon",
  'capital': "Yaoundé"
}, {
  'country': "Canada",
  'capital': "Ottawa"
}, {
  'country': "Central African Republic",
  'capital': "Bangui"
}, {
  'country': "Chad",
  'capital': "N'Djamena"
}, {
  'country': "Chile",
  'capital': "Santiago"
}, {
  'country': 'China',
  'capital': "Beijing"
}, {
  'country': 'Colombia',
  'capital': "Bogotá"
}, {
  'country': "Comoros",
  'capital': 'Moroni'
}, {
  'country': "Congo, Democratic Republic of the",
  'capital': "Kinshasa"
}, {
  'country': "Congo, Republic of the",
  'capital': 'Brazzaville'
}, {
  'country': "Costa Rica",
  'capital': "San José"
}, {
  'country': "Croatia",
  'capital': "Zagreb"
}, {
  'country': "Cuba",
  'capital': 'Havana'
}, {
  'country': "Cyprus",
  'capital': "Nicosia"
}, {
  'country': "Czech Republic",
  'capital': "Prague"
}, {
  'country': "Denmark",
  'capital': "Copenhagen"
}, {
  'country': "Djibouti",
  'capital': 'Djibouti'
}, {
  'country': "Dominica",
  'capital': "Roseau"
}, {
  'country': "Dominican Republic",
  'capital': "Santo Domingo"
}, {
  'country': "East Timor",
  'capital': 'Dili'
}, {
  'country': 'Ecuador',
  'capital': "Quito"
}, {
  'country': 'Egypt',
  'capital': 'Cairo'
}, {
  'country': "El Salvador",
  'capital': "San Salvador"
}, {
  'country': "Equatorial Guinea",
  'capital': "Malabo"
}, {
  'country': 'Eritrea',
  'capital': "Asmara"
}, {
  'country': 'Estonia',
  'capital': "Tallinn"
}, {
  'country': 'Eswatini',
  'capital': "Mbabane"
}, {
  'country': "Ethiopia",
  'capital': "Addis Ababa"
}, {
  'country': "Fiji",
  'capital': "Suva"
}, {
  'country': 'Finland',
  'capital': 'Helsinki'
}, {
  'country': "France",
  'capital': "Paris"
}, {
  'country': "Gabon",
  'capital': 'Libreville'
}, {
  'country': "Gambia",
  'capital': 'Banjul'
}, {
  'country': "Georgia",
  'capital': "Tbilisi"
}, {
  'country': "Germany",
  'capital': "Berlin"
}, {
  'country': "Ghana",
  'capital': "Accra"
}, {
  'country': "Greece",
  'capital': 'Athens'
}, {
  'country': "Grenada",
  'capital': "St. George's"
}, {
  'country': "Guatemala",
  'capital': "Guatemala City"
}, {
  'country': 'Guinea',
  'capital': 'Conakry'
}, {
  'country': "Guinea-Bissau",
  'capital': "Bissau"
}, {
  'country': "Guyana",
  'capital': "Georgetown"
}, {
  'country': "Haiti",
  'capital': "Port-au-Prince"
}, {
  'country': "Honduras",
  'capital': 'Tegucigalpa'
}, {
  'country': "Hungary",
  'capital': 'Budapest'
}, {
  'country': 'Iceland',
  'capital': 'Reykjavík'
}, {
  'country': 'India',
  'capital': "New Delhi"
}, {
  'country': "Indonesia",
  'capital': "Jakarta"
}, {
  'country': "Iran",
  'capital': "Tehran"
}, {
  'country': "Iraq",
  'capital': "Baghdad"
}, {
  'country': "Ireland",
  'capital': "Dublin"
}, {
  'country': "Israel",
  'capital': "Jerusalem"
}, {
  'country': "Italy",
  'capital': "Rome"
}, {
  'country': 'Jamaica',
  'capital': "Kingston"
}, {
  'country': "Japan",
  'capital': "Tokyo"
}, {
  'country': 'Jordan',
  'capital': "Amman"
}, {
  'country': "Kazakhstan",
  'capital': "Astana"
}, {
  'country': "Kenya",
  'capital': "Nairobi"
}, {
  'country': 'Kiribati',
  'capital': "Tarawa"
}, {
  'country': "Korea, North",
  'capital': "Pyongyang"
}, {
  'country': "Korea, South",
  'capital': 'Seoul'
}, {
  'country': "Kosovo",
  'capital': "Pristina"
}, {
  'country': "Kuwait",
  'capital': "Kuwait City"
}, {
  'country': "Kyrgyzstan",
  'capital': 'Bishkek'
}, {
  'country': "Laos",
  'capital': "Vientiane"
}, {
  'country': "Latvia",
  'capital': 'Riga'
}, {
  'country': 'Lebanon',
  'capital': "Beirut"
}, {
  'country': 'Lesotho',
  'capital': "Maseru"
}, {
  'country': 'Liberia',
  'capital': "Monrovia"
}, {
  'country': "Libya",
  'capital': 'Tripoli'
}, {
  'country': "Liechtenstein",
  'capital': "Vaduz"
}, {
  'country': "Lithuania",
  'capital': "Vilnius"
}, {
  'country': 'Luxembourg',
  'capital': "Luxembourg City"
}, {
  'country': "Madagascar",
  'capital': "Antananarivo"
}, {
  'country': "Malawi",
  'capital': "Lilongwe"
}, {
  'country': "Malaysia",
  'capital': "Kuala Lumpur"
}, {
  'country': "Maldives",
  'capital': "Malé"
}, {
  'country': "Mali",
  'capital': 'Bamako'
}, {
  'country': "Malta",
  'capital': "Valletta"
}, {
  'country': "Marshall Islands",
  'capital': "Majuro"
}, {
  'country': 'Mauritania',
  'capital': "Nouakchott"
}, {
  'country': 'Mauritius',
  'capital': "Port Louis"
}, {
  'country': "Mexico",
  'capital': "Mexico City"
}, {
  'country': 'Micronesia',
  'capital': "Palikir"
}, {
  'country': "Moldova",
  'capital': "Chișinău"
}, {
  'country': "Monaco",
  'capital': 'Monaco'
}, {
  'country': 'Mongolia',
  'capital': "Ulaanbaatar"
}, {
  'country': "Montenegro",
  'capital': "Podgorica"
}, {
  'country': 'Morocco',
  'capital': "Rabat"
}, {
  'country': 'Mozambique',
  'capital': "Maputo"
}, {
  'country': 'Myanmar',
  'capital': "Naypyidaw"
}, {
  'country': "Namibia",
  'capital': "Windhoek"
}, {
  'country': "Nauru",
  'capital': "Yaren District"
}, {
  'country': "Nepal",
  'capital': 'Kathmandu'
}, {
  'country': 'Netherlands',
  'capital': 'Amsterdam'
}, {
  'country': "New Zealand",
  'capital': 'Wellington'
}, {
  'country': "Nicaragua",
  'capital': 'Managua'
}, {
  'country': "Niger",
  'capital': 'Niamey'
}, {
  'country': "Nigeria",
  'capital': "Abuja"
}, {
  'country': "North Macedonia",
  'capital': "Skopje"
}, {
  'country': "Norway",
  'capital': "Oslo"
}, {
  'country': "Oman",
  'capital': "Muscat"
}, {
  'country': 'Pakistan',
  'capital': "Islamabad"
}, {
  'country': 'Palau',
  'capital': "Ngerulmud"
}, {
  'country': "Panama",
  'capital': "Panama City"
}, {
  'country': "Papua New Guinea",
  'capital': "Port Moresby"
}, {
  'country': "Paraguay",
  'capital': "Asunción"
}, {
  'country': 'Peru',
  'capital': "Lima"
}, {
  'country': "Philippines",
  'capital': "Manila"
}, {
  'country': "Poland",
  'capital': "Warsaw"
}, {
  'country': 'Portugal',
  'capital': "Lisbon"
}, {
  'country': 'Qatar',
  'capital': 'Doha'
}, {
  'country': 'Romania',
  'capital': "Bucharest"
}, {
  'country': "Russia",
  'capital': "Moscow"
}, {
  'country': "Rwanda",
  'capital': "Kigali"
}, {
  'country': "Saint Kitts and Nevis",
  'capital': "Basseterre"
}, {
  'country': "Saint Lucia",
  'capital': 'Castries'
}, {
  'country': "Saint Vincent and the Grenadines",
  'capital': "Kingstown"
}, {
  'country': "Samoa",
  'capital': "Apia"
}, {
  'country': "San Marino",
  'capital': "San Marino"
}, {
  'country': "Sao Tome and Principe",
  'capital': "São Tomé"
}, {
  'country': "Saudi Arabia",
  'capital': "Riyadh"
}, {
  'country': "Senegal",
  'capital': "Dakar"
}, {
  'country': "Serbia",
  'capital': "Belgrade"
}, {
  'country': 'Seychelles',
  'capital': "Victoria"
}, {
  'country': "Sierra Leone",
  'capital': "Freetown"
}, {
  'country': "Singapore",
  'capital': "Singapore"
}, {
  'country': "Slovakia",
  'capital': "Bratislava"
}, {
  'country': "Slovenia",
  'capital': "Ljubljana"
}, {
  'country': "Solomon Islands",
  'capital': "Honiara"
}, {
  'country': "Somalia",
  'capital': 'Mogadishu'
}, {
  'country': "South Africa",
  'capital': "Pretoria"
}, {
  'country': "South Sudan",
  'capital': "Juba"
}, {
  'country': "Spain",
  'capital': "Madrid"
}, {
  'country': "Sri Lanka",
  'capital': "Sri Jayawardenepura Kotte"
}, {
  'country': 'Sudan',
  'capital': "Khartoum"
}, {
  'country': "Suriname",
  'capital': "Paramaribo"
}, {
  'country': "Sweden",
  'capital': "Stockholm"
}, {
  'country': "Switzerland",
  'capital': 'Bern'
}, {
  'country': "Syria",
  'capital': 'Damascus'
}, {
  'country': "Taiwan",
  'capital': "Taipei"
}, {
  'country': "Tajikistan",
  'capital': 'Dushanbe'
}, {
  'country': "Tanzania",
  'capital': "Dodoma"
}, {
  'country': "Thailand",
  'capital': 'Bangkok'
}, {
  'country': 'Togo',
  'capital': "Lomé"
}, {
  'country': "Tonga",
  'capital': "Nukuʻalofa"
}, {
  'country': "Trinidad and Tobago",
  'capital': "Port of Spain"
}, {
  'country': "Tunisia",
  'capital': "Tunis"
}, {
  'country': "Turkey",
  'capital': "Ankara"
}, {
  'country': "Turkmenistan",
  'capital': 'Ashgabat'
}, {
  'country': 'Tuvalu',
  'capital': "Funafuti"
}, {
  'country': "Uganda",
  'capital': "Kampala"
}, {
  'country': "Ukraine",
  'capital': "Kyiv"
}, {
  'country': "United Arab Emirates",
  'capital': "Abu Dhabi"
}, {
  'country': "United Kingdom",
  'capital': "London"
}, {
  'country': "United States",
  'capital': "Washington, D.C."
}, {
  'country': "Uruguay",
  'capital': "Montevideo"
}, {
  'country': "Uzbekistan",
  'capital': "Tashkent"
}, {
  'country': "Vanuatu",
  'capital': "Port Vila"
}, {
  'country': "Vatican City",
  'capital': "Vatican City"
}, {
  'country': "Venezuela",
  'capital': "Caracas"
}, {
  'country': 'Vietnam',
  'capital': "Hanoi"
}, {
  'country': 'Yemen',
  'capital': "Sana'a"
}, {
  'country': "Zambia",
  'capital': 'Lusaka'
}, {
  'country': "Zimbabwe",
  'capital': 'Harare'
}];
const axios = require('axios');
const fs = require('fs');
const { writeFile } = require('fs/promises')
zokou({
  nomCom: "currencylist",
  aliases: ["currencies", "conversionrates"],
  reaction: '💲',
  categorie: "trade-place"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  const fetchCurrencyRates = async () => {
    try {
      const response = await axios.get('https://v6.exchangerate-api.com/v6/0d36793326ec3af0c240a8d4/latest/USD');
      const data = response.data;

      // Check if the response is successful
      if (data && data.result === "success") {
        return data.conversion_rates;
      } else {
        throw new Error('Failed to retrieve currency rates.');
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      return null;
    }
  };

  try {
    const conversionRates = await fetchCurrencyRates();

    if (!conversionRates) {
      return repondre('Failed to retrieve currency rates. Please try again later.');
    }

    let message = '*Currency Conversion Rates*\n\n';
    for (const [currency, rate] of Object.entries(conversionRates)) {
      message += `*${currency}*: ${rate}\n`;
    }

    await zk.sendMessage(dest, { text: message });
  } catch (error) {
    console.error('Error sending currency list:', error);
    await repondre('Something went wrong while sending the currency list. Please try again later.');
  }
});
// Commande waifu
zokou({
  nomCom: "waifu",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/waifu'; // Remplacez avec le lien réel de l'API waifu.pics

  try {

    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande neko
zokou({
  nomCom: "neko",
  categorie: "Weeb",
  reaction: "😺"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/neko'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API de nekos

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande shinobu
zokou({
  nomCom: "shinobu",
  categorie: "Weeb",
  reaction: "🦋"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/shinobu'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Shinobu

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande megumin
zokou({
  nomCom: "megumin",
  categorie: "Weeb",
  reaction: "💥"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/megumin'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Megumin

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage,{ image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});



zokou({
  nomCom: "cosplay",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;



  try {
    for (let i = 0; i < 5; i++) {
      let url = 'https://fantox-cosplay-api.onrender.com/'

   const response = await   axios.get(url, { responseType: 'arraybuffer' })



  const image = response.data;

   await writeFile('./cosplay.jpg', image)
      zk.sendMessage(origineMessage,{image : {url : `./cosplay.jpg`}},{quoted :ms}) }

  } catch (e) {
    repondre("je reçois malheureusement une erreur : " + e);
  }
});
zokou({
  nomCom: "forex",
  categorie: "trade-place",
  desc: "Fetches the latest forex news",
  reaction: "💲",
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  try {
    const apiUrl = "https://api.polygon.io/v2/reference/news?apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.results || data.results.length === 0) {
      return repondre("*No forex news available at the moment.*");
    }

    const articles = data.results;
    let output = "";

    articles.forEach((article, index) => {
      output += `*Title:* ${article.title}\n`;
      output += `*Publisher:* ${article.publisher.name}\n`;
      output += `*Published UTC:* ${article.published_utc}\n`;
      output += `*Article URL:* ${article.article_url}\n\n`;

      if (index < articles.length - 1) {
        output += "---\n\n";
      }
    });

    return repondre(output, { quoted: zk });
  } catch (error) {
    console.error('Error fetching forex news:', error);
    return repondre("*Failed to fetch forex news.*");
  }
});
zokou({
  nomCom: "fxstatus",
  categorie: "trade-place",
  desc: "Fetches the current status of the forex market",
  reaction: "💲",
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const apiUrl = "https://api.polygon.io/v1/marketstatus/now?apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data) {
      return repondre("*Failed to fetch forex market status.*");
    }

    let output = "*Forex Market Status:*\n";
    output += `After Hours: ${data.afterHours ? "Closed" : "Open"}\n`;
    output += `Market: ${data.market ? "Open" : "Closed"}\n`;

    const currencies = data.currencies;
    output += "\n*Currencies:*\n";
    output += `Crypto: ${currencies.crypto}\n`;
    output += `FX: ${currencies.fx}\n`;

    const exchanges = data.exchanges;
    output += "\n*Exchanges:*\n";
    output += `NASDAQ: ${exchanges.nasdaq}\n`;
    output += `NYSE: ${exchanges.nyse}\n`;
    output += `OTC: ${exchanges.otc}\n`;

    const indicesGroups = data.indicesGroups;
    output += "\n*Indices Groups:*\n";
    output += `S&P: ${indicesGroups.s_and_p}\n`;
    output += `Societe Generale: ${indicesGroups.societe_generale}\n`;
    output += `MSCI: ${indicesGroups.msci}\n`;
    output += `FTSE Russell: ${indicesGroups.ftse_russell}\n`;
    output += `MStar: ${indicesGroups.mstar}\n`;
    output += `MStarC: ${indicesGroups.mstarc}\n`;
    output += `CCCY: ${indicesGroups.cccy}\n`;
    output += `CGI: ${indicesGroups.cgi}\n`;
    output += `NASDAQ: ${indicesGroups.nasdaq}\n`;
    output += `Dow Jones: ${indicesGroups.dow_jones}\n`;

    output += `\n*Server Time:* ${data.serverTime}\n`;

    return repondre(output, { quoted: ms });
  } catch (error) {
    console.error('Error fetching forex market status:', error);
    return repondre("*Failed to fetch forex market status.*");
  }
});

zokou({
  nomCom: "fxpairs",
aliases: ["forexpairs", "pairforex"],
  categorie: "trade-place",
  desc: "Fetches a list of active forex currency pairs",
  reaction: "💲",
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const apiUrl = "https://api.polygon.io/v3/reference/tickers?market=fx&active=true&apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45";
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
      return repondre("*Failed to fetch forex currency pairs.*");
    }

    let output = "*Active Forex Currency Pairs:*\n\n";
    data.results.forEach((pair) => {
      output += `${pair.ticker}: ${pair.name}\n`;
    });

    return repondre(output, { quoted: ms });
  } catch (error) {
    console.error('Error fetching forex currency pairs:', error);
    return repondre("*Failed to fetch forex currency pairs.*");
  }
});

zokou({
  nomCom: "stocktickers",
  aliases: ["stockticks", "tickets"],
  categorie: "trade-place",
  desc: "Fetches a list of active stock tickers",
  reaction: "💲",
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const limit = 100; // Assuming a default limit of 100, or you can customize this as needed
    const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&limit=${limit}&apiKey=Y4iTYoJANwppB8I3Bm4QVWdV5oXlvc45`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
      return repondre("*No active stock tickers found.*");
    }

    let output = `*Active Stock Tickers (Limit: ${limit}):*\n\n`;
    data.results.forEach((ticker) => {
      output += `${ticker.ticker}: ${ticker.name}\n`;
    });

    return repondre(output, { quoted: ms });
  } catch (error) {
    console.error('Error fetching stock tickers:', error);
    return repondre("*Failed to fetch stock tickers.*");
  }
});

zokou({
  nomCom: "fxexchange",
  aliases: ["forexexchange", "exchangerate"],
  categorie: "trade-place",
  desc: "Fetches the latest foreign exchange rates against the US Dollar",
  reaction: "💲",
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const currencyCode = "USD"; // Using default currency code as USD
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyCode}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.rates) {
      return repondre(`*Failed to fetch exchange rates for ${currencyCode}.*`);
    }

    let output = `*Foreign Exchange Rates (${data.base})*\n\n`;
    for (const [currency, rate] of Object.entries(data.rates)) {
      output += `${currency}: ${rate.toFixed(4)}\n`;
    }

    return repondre(output, { quoted: ms });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return repondre("*Failed to fetch exchange rates.*");
  }
});
zokou({
  'nomCom': "guesscapital",
  'categorie': "Games"
}, async (_0x4d7648, _0x864b53, _0x44ebdc) => {
  const {
    ms: _0x18517b,
    repondre: _0x474575,
    prefixe: _0x134a54
  } = _0x44ebdc;
  const _0x4744fb = capitalGame[Math.floor(Math.random() * capitalGame.length)];
  await _0x864b53.sendMessage(_0x4d7648, {
    'text': "🌍 Guess the capital city of this country: " + _0x4744fb.country + "\n\nYou have 30 seconds to guess!"
  }, {
    'quoted': _0x18517b
  });
  const _0x1acc69 = async (_0x37e5cf, _0xbf3a82, _0x3e1079) => {
    return _0x37e5cf.toLowerCase() === _0x4744fb.capital.toLowerCase() ? (await _0x864b53.sendMessage(_0x4d7648, {
      'text': "✅ Correct! The capital city is " + _0x4744fb.capital + '.'
    }, {
      'quoted': _0xbf3a82
    }), true) : _0x3e1079 === 0x1 ? (await _0x864b53.sendMessage(_0x4d7648, {
      'text': "❌ Wrong answer! You have one more try."
    }, {
      'quoted': _0xbf3a82
    }), false) : (await _0x864b53.sendMessage(_0x4d7648, {
      'text': "⏳ Time's up! The correct answer was: " + _0x4744fb.capital
    }, {
      'quoted': _0xbf3a82
    }), true);
  };
  const _0x594193 = _0x5bdfda => new Promise(_0x2eb2d6 => setTimeout(_0x2eb2d6, _0x5bdfda));
  await _0x594193(0x2710);
  const _0x357047 = {
    'text': 'exampleUserResponse',
    'message': _0x18517b
  };
  if (!(await _0x1acc69('exampleUserResponse', _0x357047.message, 0x1))) {
    await _0x594193(0x3e8);
    await _0x864b53.sendMessage(_0x4d7648, {
      'text': "You now have 10 seconds to make another guess!"
    }, {
      'quoted': _0x18517b
    });
    await _0x594193(0x2710);
    const _0x3ba42a = {
      'text': "exampleUserResponse",
      'message': _0x18517b
    };
    await _0x1acc69("exampleUserResponse", _0x3ba42a.message, 0x2);
  } else {
    await _0x864b53.sendMessage(_0x4d7648, {
      'text': "Try, you might get this!"
    }, {
      'quoted': _0x18517b
    });
  }
})
