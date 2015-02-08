function fromReq(req){
  return req.protocol + "://" + req.get("host");
}

module.exports = {
  fromReq: fromReq
};
