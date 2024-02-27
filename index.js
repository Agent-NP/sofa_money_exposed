const axios = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const request_timeout = "50000";

const bot_token = process.env.bot_token;
const chat_id = "6524312327";
let root_url = `https://api.telegram.org/bot${bot_token}`;
let matchesWithRedCard = [];

const sendMessage = async text_message => {
  let deliveryMan = `${root_url}/sendMessage?chat_id=${chat_id}&text=${text_message}`;
  await axios
    .get(deliveryMan)
    .then(() => {
      console.log("Message Sent!");
    })
    .catch(error => {
      console.log(error);
    });
};

const { getRandomUserAgent } = require("./util/get_random_user_agent");

const makeRequest = async () => {
    const params = {
      headers: {
        "User-Agent": getRandomUserAgent().userAgent
      }
    };
  const liveMatchesUrl =
    "https://api.sofascore.com/api/v1/sport/football/events/live";
  const response = await axios.get(liveMatchesUrl, params, {
    timeout: request_timeout
  });


  const data = response.data.events;
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const match = data[i];
    const matchLink = `https://www.sofascore.com/${match.slug}/${match.customId}#id:${match
      .tournament.id}`;
    if (!matchesWithRedCard.includes(matchLink)) {
      if (data[i].homeRedCards > 0 || data[i].awayRedCards > 0) {
        const homeTeam = match.homeTeam.name;
        const awayTeam = match.awayTeam.name;
        const teams = homeTeam + " vs " + awayTeam;
        const game = match.tournament.name;
        const homeScore = match.homeScore.current;
        const awayScore = match.awayScore.current;
        const homeRedCards = match.homeRedCards ? match.homeRedCards : "None";
        const awayRedCards = match.awayRedCards ? match.awayRedCards : "None";
        matchesWithRedCard.push(matchLink);
        const message = `GAME: ${game}
        TEAMS: ${teams}
        RED_CARD: HOME [${homeRedCards}], AWAY: {${awayRedCards}}
        SCORES: ${homeScore}:${awayScore}
        REVIEW: ${matchLink}`;
        sendMessage(message);
      }
    }
  }
};

// setInterval(() => {
//   makeRequest();
// }, 10000);

app.listen(PORT, () => {
  console.log("Server Listening at PORT: ", PORT);
  makeRequest();
});

//Get Match current score
//Get Which team got the red card
//Get the time of the red card
