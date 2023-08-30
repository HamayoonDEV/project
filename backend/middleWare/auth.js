import JwtServices from "../services/JwtServices.js";

import User from "../models/user.js";

const auth = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    const error = {
      status: 401,
      message: "UnAuthorized!!!!",
    };
    return next(error);
  }

  //verify accessToken
  let _id;
  try {
    _id = JwtServices.verifyAccessToken(accessToken)._id;
  } catch (error) {
    return next(error);
  }
  let user;
  try {
    user = await User.findOne({ _id: _id });
  } catch (error) {
    return next(error);
  }
  req.user = user;
  next();
};

export default auth;
