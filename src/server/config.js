var rekuire = require("rekuire");

module.exports = {
  secrets: rekuire("secrets"),
  db: {
    tables: {
      users: {
        name: "users",
        columns: {
          githubId: "github_id",
          githubAccessToken: "github_access_token"
        }
      },
      accessTokens: {
        name: "access_tokens",
        columns: {
          accessToken: "access_token",
          githubUserId: "github_user_id",
          expiresOn: "expires_on"
        }
      }
    }
  }
};
