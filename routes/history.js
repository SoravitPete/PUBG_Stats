const express = require('express');
const router = express.Router();

router.get('/:playerName1/:playerName2', async (req, res) => {
    try {
        const headers = {
            "Accept": 'application/json',
            "Authorization": `Bearer ${process.env.PUBG_API_KEY}` // Include the Bearer token
        };

        const { playerName1, playerName2 } = req.params;

        const response1 = await fetch(`http://localhost:5000/api/v1/profile/${playerName1}`, {
            headers
        });

        const response2 = await fetch(`http://localhost:5000/api/v1/profile/${playerName2}`, {
            headers
        });

        const data1 = await response1.json();
        const data2 = await response2.json();

        // Temporary memory for match IDs
        const llistPlayer1 = [];
        const llistPlayer2 = [];

        // Extract match IDs for player 1
        if (data1 && data1.data && data1.data[0] && data1.data[0].relationships && data1.data[0].relationships.matches && data1.data[0].relationships.matches.data) {
            for (let i = 0; i < data1.data[0].relationships.matches.data.length; i++) {
                const currentObject = data1.data[0].relationships.matches.data[i];
                console.log(`Player 1 Match Object:`, currentObject);
                if (currentObject && currentObject.id) {
                    llistPlayer1.push(currentObject.id);
                }
            }
        } else {
            console.warn(`Could not find match data for player ${playerName1}`);
        }

        // Extract match IDs for player 2
        if (data2 && data2.data && data2.data[0] && data2.data[0].relationships && data2.data[0].relationships.matches && data2.data[0].relationships.matches.data) {
            for (let i = 0; i < data2.data[0].relationships.matches.data.length; i++) {
                const currentObject = data2.data[0].relationships.matches.data[i];
                console.log(`Player 2 Match Object:`, currentObject);
                if (currentObject && currentObject.id) {
                    llistPlayer2.push(currentObject.id);
                }
            }
        } else {
            console.warn(`Could not find match data for player ${playerName2}`);
        }

        // Find common match IDs
        const commonMatches = llistPlayer1.filter(matchId1 => llistPlayer2.includes(matchId1));

        res.json({ commonMatches }); // Send the list of common match IDs
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;