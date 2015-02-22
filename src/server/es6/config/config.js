var config = {
  oio: {
    collections: {
      users: "users"
    }
  },
  routes: {
    auth: {
      connect: "/api/auth/connect",
      callback: "/api/auth/callback"
    }
  },
  errors: {
    badGhState: 0,
    badGhTokenResp: 1,
    oioSaveUserError: 2
  }
};

export default config;
