#PAMM Site
A website for Planetary Annihilation mods

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

#Api Documentation
**Root Url**: `/api/v1`  

##Authetication
**Root Url**: `/auth`

```
GET /connect
```
Starts the Github OAuth flow

---
```
GET /oauth_callback
```
Github OAuth flow endpoint

---
```
GET /access_token
```
Returns `user_id` of associated user. Expects the following parameters:

| Name | Type | Description |
| ---- | ---- | ----------- |
| access_token | `string` via query param | The Access Token to find the user for |

##Users
**Root Url**: `/user`
