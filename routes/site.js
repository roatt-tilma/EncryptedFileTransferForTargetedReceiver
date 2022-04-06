const router = require('express').Router();

router.route('/upload').get((req,res) => {
    res.render('upload', { title: 'UPLOAD' })
});

module.exports = router;