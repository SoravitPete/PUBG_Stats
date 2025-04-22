const express = require('express');
const router = express.Router();

router.get('/:playerName', async(req, res) => {
    // console.log(req.params.platform, req.params.gamertag)
    // res.send('Hello')
    try {
        const headers = {
            "Accept": 'application/json',
            "Authorization": `Bearer ${process.env.PUBG_API_KEY}` // Include the Bearer token in the Authorization header
        }

        const { playerName } = req.params;

        const response = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`, {
            headers
        });

        const data = await response.json();

        res.json(data);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;