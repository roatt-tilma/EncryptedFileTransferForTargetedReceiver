const router = require('express').Router();


const user_signup = require('../controllers/authenticationControllers');

router.route('/loginform').get((req, res) => {
    res.render('loginform', { title: 'LOGIN' });
});

router.route('/signupform').get((req, res) => {
    res.render('signupform', { title: 'SIGNUP' });
})

router.route('/add').post(user_signup);

router.use((req, res) => {
    res.send("404 not found!");
});



module.exports = router;
