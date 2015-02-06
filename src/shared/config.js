module.exports = function(dev) {
  if (dev === undefined) {
    dev = false;
  }

  return {
    url: dev ? "127.0.0.1:9000" : "https://pamm-site.herokuapp.com/"
  };
};
