const { HttpError, sendEmail } = require("../../helpers");
const { User } = require("../../models/user.js");
const ElasticEmail = require("@elasticemail/elasticemail-client");

const { BASE_URL, EMAIL_FROM } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    Recipients: [new ElasticEmail.EmailRecipient(email)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
        }),
      ],
      Subject: "Verify email",
      From: EMAIL_FROM,
    },
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

module.exports = resendVerifyEmail;
