
# Passport Photo

## Install

    npm install passport-photo

## Usage

```javascript
var photo = require("passport-photo");
var fb = require("passport-photo-facebook");
var gravatar = require("passport-photo-gravatar")

photo.use(gravatar());
photo.use(fb.id());
photo.use(fb.token());
photo.use(fb.search({access_token:"Any Valid Access Token"}));
//Default methods are never cached and must not return 404.
photo.useDefault(gravatar({default:"identicon"}));

photo({facebookid:445461, access_token:"User's Access Token",email:"user@example.com"}, function(err, avatarURL){
  if(!err) require('request')(avatarURL).pipe(require('fs').createWriteStream("./avatar.jpg"));
});
```

Passport photo will try each strategy in turn until one of them returns a valid avatar url.  It always checks to make sure urls don't return 404, so for example, the gravatar method doesn't need to handle 404's internally.  This means that if you are returned a URL, it will provide a response code of 200 (after following any redirects).

## Defining additional strategies

A strategy just consists of a simple function which takes a user and a callback e.g.

```javascript
function default(user, callback){
    callback("http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm");
}
photo.use(default);
```

## Available Strategies

This is the list of currently implimented strategies.

 * [Facebook](https://github.com/Tuskan360/passport-photo-facebook) - Can retrieve using User ID, Access Token or e-mail
 * [Gravatar](https://github.com/Tuskan360/passport-photo-gravatar) - Can retrieve using e-mail, username support would be great

## Other Pluggins

Soon, you can expect caches and middleware for connect/express to be listed here.

## API

### use

Add another strategy to the list of strategies used in a standard flow.

@param strategy {function} function(user, callback([url]))    

### useDefault

Provide a default strategy, you can only provide one of these.

There are 2 things which are special about default strategies

 1. The result of a default strategy is not cached, ever.
 2. passport-photo doesn't check that the default strategy returns a valid url, it could result in a 404 error for example and we won't catch that.

For this reason, we would typically use defaults for things where we just return a siluette of the user, or perhaps an identicon.

### useCache

As with defaults, you can only have one cache provider.  We still check the results of a cache provider to ensure they are valid urls and don't 404.

If the user is not in the cache, simply callback with no arguments.

@param cache {object} The cache service    
@param cache.get {function} function(user, callback([url])) The function to attempt to retrieve an item from the cache.    
@param cache.set {function} function(user, url, done()) Add an item to the cache.    

## Planned support in the future

 * Twitter
 * Linked In
 * Webfinger
 * Simple Web Discovery
 * Google+
 * MySpace