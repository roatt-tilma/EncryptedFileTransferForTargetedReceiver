const router = require('express').Router();

router.route('/loginform').get((req, res) => {
    res.render('loginform', { title: 'LOGIN' });
});

router.route('/signupform').get((req, res) => {
    res.render('signupform', { title: 'SIGNUP' });
})

router.use((req, res) => {
    res.send("404 not found!");
});

module.exports = router;
