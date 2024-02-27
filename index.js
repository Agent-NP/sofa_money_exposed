const axios = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const bot_token = "7078829173:AAHmU1tty7RtoE0uQdI0gDGl-Bg-rCMAWF0";
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

const makeRequest = async () => {
  const liveMatchesUrl =
    "https://api.sofascore.com/api/v1/sport/football/events/live";
  const response = await axios.get(liveMatchesUrl);
  const data = response.data;
  for (let i = 0; i < data.length; i++) {
    const match = data[i];
    const matchLink = `https://www.sofascore.com/${match.slug}/${match.customId}#id:${match
      .tournament.id}`;
    if (!matchesWithRedCard.includes(teams)) {
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

