const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('This is users page');
});

router.use((req, res) => {
    res.send("404 not found!");
});

module.exports = router;

