const express = require('express');
const router = express.Router();

router.get('/:playerName1/:playerName2', async(req, res) => {
    // console.log(req.params.platform, req.params.gamertag)
    // res.send('Hello')
    try {
        const headers = {
            "Accept": 'application/json',
            "Authorization": `Bearer ${process.env.PUBG_API_KEY}` // Include the Bearer token in the Authorization header
        }

        const { playerName1, playerName2 } = req.params;

        const response = await fetch(`http://localhost:5000/api/v1/history/${playerName1}/${playerName2}`, {
            headers
        });

        const data = await response.json()

        console.log(data)

        llist = []

        for (let i=0; i < data.commonMatches.length; i++) {
            console.log(data.commonMatches[i])
            const supResponse = await fetch(`https://api.pubg.com/shards/steam/matches/${data.commonMatches[i]}`, {
                headers
            });

            const statPlayerInMatch = await supResponse.json()

            playerStat = []

            for (let i = 0; i < statPlayerInMatch.included.length; i++) {
                if (
                    statPlayerInMatch.included[i].type === "participant" &&
                    (statPlayerInMatch.included[i].attributes.stats.name === playerName1 ||
                     statPlayerInMatch.included[i].attributes.stats.name === playerName2)
                ) {
                    playerStat.push(statPlayerInMatch.included[i]);
                }
            }

            const matchCaommonData = {
                gameMode: statPlayerInMatch.data.attributes.gameMode,
                matchType: statPlayerInMatch.data.attributes.matchType,
                duration: statPlayerInMatch.data.attributes.duration,
                mapName: statPlayerInMatch.data.attributes.mapName,
                playerStat: playerStat
            }

            llist.push(matchCaommonData)
            console.log(playerStat)
        }

        console.log(llist)

        res.json(llist);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;