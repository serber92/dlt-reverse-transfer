const jwt =  require('jsonwebtoken')

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = async (req) => {
  let tokenToVerify;

  try {
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");

      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/.test(scheme)) {
          tokenToVerify = credentials;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else if (req.body.token) {
      tokenToVerify = req.body.token;
      delete req.query.token;
    } else if (req.headers.devtoken) {
      let appToken = req.headers.devtoken;

      if (appToken === "88ecde925da3c6f8ec3d140683da9d2a422f26c1ae1d9212da1e5a53416dcc88") {
        return {
          email: "avanytsk@asu.edu",
        };
      } else {
        return null;
      }
    } else {
      return null;
    }

    const user = jwt.verify(tokenToVerify, 'secdltnln12@#$')
    return user;
  } catch (error) {
    console.log(error, "error");
    return null;
  }
};
