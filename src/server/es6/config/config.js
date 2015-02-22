var config = {
  oio: {
    collections: {
      users: "users",
      accessTokens: "accessTokens"
    }
  },
  routes: {
    api: {
      _root: "/api",
      v1: {
        _root: "/v1",
        auth: {
          _root: "/auth",
          connect: "/connect",
          callback: "/callback"
        }
      }
    }
  },
  errors: {
    api: {
      v1: {
        auth: {
          callback: {
            badGhState: 0,
            badGhCode: 1,
            ghLoginFail: 2,
            ghUserInfoFail: 3,
            ghUserInfoSaveFail: 4,
            siteAccessTokenSaveFail: 5
          }
        }
      }
    }
  }
};

export default config;
