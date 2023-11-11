const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const ElasticEmail = require("@elasticemail/elasticemail-client");

const { User } = require("../../models/user.js");

const { HttpError, sendEmail } = require("../../helpers/index.js");
const { nanoid } = require("nanoid");

const { BASE_URL, EMAIL_FROM } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const verificationCode = nanoid();

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    Recipients: [new ElasticEmail.EmailRecipient(email)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click verify email</a>`,
        }),
      ],
      Subject: "Verify email",
      From: EMAIL_FROM,
    },
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

module.exports = register;
