const { User } = require("../../models/user.js");

const patchSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription: subscription });

  res.json({
    email,
    massage: `Change subscription to ${subscription} success`,
  });
};

module.exports = patchSubscription;
