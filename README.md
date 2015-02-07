#PAMM Site
A website for Planetary Annihilation mods

#Documentation
Documentation can be found [here](http://pamm-site.readme.io/)

#Authetication
A cookie will be managed by the server which holds the users Access Token.
This token must be provided to make most PAMM-Site Api requests. This Access
Token proves to the server that the user is authenticated with Github.

#Database tables
##Users
- github_id `char`
- github_access_token `char`

##Access Tokens
- access_token `char`
- github_user_id `char`
- expires_on `time`

#Github Api
The server uses a [Github Api Wrapper](https://github.com/michael/github) and
an [OAuth wrapper](https://github.com/ciaranj/node-oauth) for the Github OAuth flow
