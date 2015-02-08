"use strict";

var rekuire = require("rekuire");

module.exports = {
  secrets: rekuire("secrets"),
  github: {
    api: {
      connect: "https://github.com/login/oauth/authorize",
      accessToken: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user"
    }
  },
  api: {
    root: "/api",
    v1: {
      root: "/v1",
      auth: {
        root: "/auth",
        connect: "/connect",
        oauthCallback: "/oauth_callback",
        accessToken: "/access_token"
      }
    }
  },
  accessToken: {
    lifetime: 14,//2 weeks
    cookieKey: "access_token"
  },
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
  },
  npm: {
    request: {
      headers: {
        "Accept": "application/json",
        "User-Agent": "PAMM-Site"
      }
    }
  }
};
