const AWS = require("aws-sdk");
const User = require("../models/user");
const Link = require("../models/links");
const jwt = require("jsonwebtoken");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const { use } = require("../routes/auth");
const _ = require("lodash");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
  // console.log('REGISTER CONTROLLER', req.body)
  const { name, email, password, categories } = req.body;

  User.findOne({ email: email }).exec((err, user) => {
    if (user) {
      console.log(err);
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    // generate jwt
    const token = jwt.sign(
      { name, email, password, categories },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    //send email
    const params = registerEmailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log("email submitted to ses", data);
        res.json({
          message: `Email has been sent to ${email},Follow the instructions to complete your registration`,
        });
      })
      .catch((error) => {
        console.log("ses email on register", error);
        res.json({
          message: `We could not verify your email. please try again`,
        });
      });
  });
};

exports.registerActivate = (req, res) => {
  const { token } = req.body;
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link, try again",
        });
      }

      const { name, email, password, categories } = jwt.decode(token);
      const username = shortId.generate();

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(401).json({
            error: "email is taken",
          });
        }
        // create new user
        const newUser = new User({
          username,
          name,
          email,
          password,
          categories,
        });
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try again later",
            });
          }
          return res.json({
            message: "Registration success. Please login.",
          });
        });
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exits. Please register.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and Password do not match",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    req.profile = user;

    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;

  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. access denied",
      });
    }

    req.profile = user;

    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user with that email does not exists",
      });
    }

    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );
    const params = forgotPasswordEmailParams(email, token);

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Password reset failed. try later",
        });
      }

      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          return res.json({
            message: `Email has been send to ${email}. Click on the link to reset your password`,
          });
        })
        .catch((err) => {
          return res.json({
            message: `We could not verify your email. Try later`,
          });
        });
    });
  });
};

exports.restPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Expired Link. Try again.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Invalid token. Try again",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Password reset failed. Try again",
              });
            }

            res.json({
              message: `Great! Now you can login with your new password`,
            });
          });
        });
      }
    );
  }
};

exports.canUpdateDeleteLink = (req, res, next) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "could not find link",
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.user._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "you are not authorized",
      });
    }
    next();
  });
};
