const router = require("express").Router();

router.route("/upload").get((req, res) => {
  res.render("upload", { title: "UPLOAD" });
});

router.route("/receiveremail").get((req, res) => {
  res.render('receiveremailform', { title: 'RECEIVER Email' });
});

router.route("/saveFile").post((req, res) => {
  console.log(req);
  console.log(req.body);

  var fs = require("fs");

  fs.writeFile("./plaintexts/" + req.body.name, req.body.content, function (err) {
    if (err) throw err;
  });

  res.status(200).send("Success!");
});

router.route('/encrypt').post((req, res) => {
    const email = req.body.email;
    
});


router.route("/decrypt").get((req, res) => {
  res.send("Decrypt page");
});

module.exports = router;
