const router = require('express').Router();

router.route('/upload').get((req,res) => {
    res.render('upload', { title: 'UPLOAD' })
});

router.route('/receiveremail').get((req, res) => {
    res.render('receiveremailform', { title: 'RECEIVER Email' });
})

module.exports = router;