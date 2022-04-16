const router = require("express").Router();
const User = require("../models/user.model");
const rsa = require("node-rsa");
const fs = require("fs");
const crypto = require("crypto");

router.route("/upload").get((req, res) => {
  res.render("upload", { title: "UPLOAD" });
});

router.route("/receiveremail").get((req, res) => {
  res.render("receiveremailform", { title: "RECEIVER Email" });
});

router.route("/saveFile").post((req, res) => {
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

router.route("/encrypt").post(async (req, res) => {
  const email = req.body.email;
  const filename = req.body.filename;

  var query = { email: email };
  const user = await User.find(query);
  const private = user[0].privateKey;

  const privatekey = new rsa();
  const publickey = new rsa();

  const public = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm6v644TfpYJPTfZTJeiG
    l2/pJ7fPt2QzRj3KjELAN+lhxc5Q4CfB58O3WMhMBj4THLZ+ctix0wK+RoGAv95I
    hFHQi4AUr/bdxr4FQvE2f6kRHaoysySjkK8l3MORilCnop7B3gv6UCddUV9dOi4H
    Ns+fp5+rDzScsRH8d8+rLhTGGLLBnIeaNUL8TOIBmLwKbFCxExQ3+As1O+/or91Z
    4+11ivQWjmple6xPImqX3ZYDjvZK+9dH89JCGfbhd0VAa92LXPqO9xcR1NS/gW1G
    HF1jdc2QPLq/dsWINjNbohp7HPtZ4hmDMAc8Xq46PT2LjYiLORKTdQc3Yga4P9iq
    6QIDAQAB
    -----END PUBLIC KEY-----`;

  privatekey.importKey(private);
  publickey.importKey(public);

  fs.readFile("./plaintexts/" + filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const encrypted = privatekey.encryptPrivate(data, "base64");

    fs.writeFile(
        "./encryptedtexts/" + filename,
        encrypted,
        function (err) {
          if (err) throw err;
        }
      );

    // const decrypted = publickey.decryptPublic(encrypted, "utf8");
  });

  res.status(200).send("Success!");
});

router.route("/emailsent").get((req, res) => {
  res.redirect("Successfully encrypted");
});

router.route("/decrypt").get((req, res) => {
  res.send("Decrypt page");
});

module.exports = router;
