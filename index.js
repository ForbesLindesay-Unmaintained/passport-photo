var strategies = [];
var defaultStrategy = function(user, callback){
  callback();
};
var cacheSet = function(user, url, callback){
  callback();
};
var request = require('request');


/*
 * Get the url for the user
 * 
 * @param user {object} the user to get an avatar for
 * @param callback {function} function(err, url)
 * @api public
 */
module.exports = function(user, callback){
  function success(url){
    cacheSet(user, url, function(){
      callback(null, url);
    });
  };
  function fail(){
    defaultStrategy(user, function(url){
      if(url) callback(null, url);
      else callback("could not get avatar for user");
    });
  };
  function next(i){
    if(i === strategies.length) return fail();
    strategies[i](user, function(url){
      if(!url) return next(i+1);
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          success(url);
        } else {
          next(i+1);
        }
      });
    });
  }
  next(0);
}
exports = module.exports;

exports.useHTTPs = false;

/**
 * Utilize the given `strategy`
 *
 * Examples:
 *
 *     passport.use(gravatar(...));
 *
 * @param strategy {Strategy} strategy
 * @return {Passport-Photo} for chaining
 * @api public
 */
exports.use = function(strategy) {
  if(typeof strategy !== "function") throw "strategy must be a function(user, next(url))"
  strategies.push(strategy);
  return module.exports;
};
exports.useDefault = function(strategy) {
  if(typeof strategy !== "function") throw "strategy must be a function(user, next(url))"
  defaultStrategy = strategy;
  return module.exports;
};
exports.useCache = function(cache){
  if(typeof cache.get !== "function") throw "cache.get must be a function(user, next(url))"
  if(typeof cache.set !== "function") throw "cache.set must be a function(user, url, next())"
  strategies.unshift(cache.get);
  cacheSet = cache.set;
};