const router = require("express").Router();
const User = require("../models/user.model");
const rsa = require("node-rsa");
const fs = require("fs");

router.route("/upload").get((req, res) => {
  res.render("upload", { title: "UPLOAD" });
});

router.route("/receiveremail").get((req, res) => {
  res.render("receiveremailform", { title: "RECEIVER Email" });
});

router.route("/receiverpublickey").get((req, res) => {
  res.render("receiverpublickeyform", {title: "RECEIVER Public Key"});
})

router.route("/saveFile/encrypt").post((req, res) => {
  var fs = require("fs");

  fs.writeFile(
    "./plaintexts/" + req.body.name,
    req.body.content,
    function (err) {
      if (err) throw err;
    }
  );

  res.status(200).send("Success!");
});

router.route("/saveFile/decrypt").post((req, res) => {
  var fs = require("fs");

  fs.writeFile(
    "./encryptedtexts/" + req.body.name,
    req.body.content,
    function (err) {
      if (err) throw err;
    }
  );

  res.status(200).send("Success!");
});


router.route("/encrypt").post(async (req, res) => {
  const email = req.body.email;
  const filename = req.body.filename;

  var query = { email: email };
  const user = await User.find(query);
  const private = user[0].privateKey;

  const privatekey = new rsa();

  privatekey.importKey(private);

  fs.readFile("./plaintexts/" + filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const encrypted = privatekey.encryptPrivate(data, "base64");

    fs.writeFile("./encryptedtexts/" + filename, encrypted, function (err) {
      if (err) throw err;
    });

    //send mail
    //delete from encryptedtexts

  });

  fs.unlinkSync("./plaintexts/" + filename);

  //delete from plaintexts

  res.status(200).send("Success!");
});

router.route("/decrypt").get((req, res) => {
  const public = req.body.publickey;
  const filename = req.body.filename;

  const publickey = new rsa();
    
  publickey.importKey(public);

  fs.readFile("./encryptedtexts/" + filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const decrypted = publickey.decryptPublic(data, "utf8");

    fs.writeFile("./plaintexts/" + filename, decrypted, function (err) {
      if (err) throw err;
    });

    //send mail

    //delete from plaintexts
    console.log(decrypted);
    
  });

  fs.unlinkSync("./encryptedtexts/" + filename);
  //delete from encryptedtexts

  res.status(200).send("Success!");
  
});

module.exports = router;
