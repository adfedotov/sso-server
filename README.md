# Single Sign On (SSO) Server

An SSO server implementation that can be used to handle authentication across subdomains (and different domains in the future). Applications on other subdomains use the SSO server by verifying JWT token on routes that require the user to be logged in. If no token is present, the user is sent to the SSO login page with a redirect link back to the app. The signed JWT token is stored in 'access_token' cookie.

## Getting Started

### Prerequisites
If not using docker-compose, you need to have access to MongoDB

### Configuration
Create a .env file with all the constants
```bash
SSO_NAME=name       # Name displayed on the login/register page
HOST=0.0.0.0        # Node host
PORT=3001           # Node port
SECRET=secret       # Secret used for signing JWT
DOMAIN=127.0.0.1    # Domain used for setting cookie. (For cookie to persist between subdomains, 
                    # include . in front of the domain) Example: .mydomain.com
                    
DEFAULT_REDIRECT=https://andreifedotov.com      # Redirect when user logs in without specified redirect
ALLOWED_HOSTS=127.0.0.1:3001,andreifedotov.com  # Redirect is only allowed to these hosts separated by commas
MIN_PASSWORD_LENGTH=6
MONGO_USER=sso      # MongoDB connection
MONGO_PASS=password
MONGO_HOST=sso-db   # If using docker-compose, use the name of db service
MONGO_PORT=27017
MONGO_DB=sso
MONGO_USER_COLLECTION=users   # Which colleciton to use
```

### Starting
#### Using docker-compose
Make sure to have .env setup
```bash
docker-compose up
```
Now access it on 127.0.0.1:port/auth/login

#### Using docker
Setup using dev.env
Create image and run it
```bash
docker build -t sso-server . 
docker run -d -p [port]:[port] --name SSO-server sso-server
```
Now access it on 127.0.0.1:port/auth/login

#### Not using docker
Setup using dev.env
Install dependencies and run node
```bash
npm install
npm start  # or node index.js
```

## Flow

The SSO default 
- login page: /auth/login
- register page: /auth/register
- logout: /auth/logout
                
Applications send unauthenticated users to the login page by redirecting and including redirect link back to the app.
- Example login: /auth/login?service=http://<span></span>ss.mydomain.com/dashboard (host has to be allowed in sso config)
- Example register: /auth/register?service=http://<span></span>ss.mydomain.com/dsahboard
- Exampe logout: /auth/logout?service=http://<span></span>ss.mydomain.com

After the user is logged in/registered, they are sent to the provided redirect link, at this point, they should have been assigned a JWT token.

For an app to check whether the user is logged in or not, it should check whether there is token present ('access_token' cookie) and verify it with the SSO server by sending a JSON POST request to /verify. [In the future, apps will have to verify their own identity with the SSO server to use /verify].

Sample JSON request to /verify:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e..."
}
```

- If request is inproperly formatted, server will respond with 400.
- If request is valid, the SSO server responds with a JSON containing verified value (bool)

Sample JSON response:
```json
{
  "verified": false
}
```

## Token
The JWT token contains 
- user id (mongo objectID)
- first name (string)
- last name (string)
- email (string)
- admin (boolean)

## What I plan to do next
- Allow for use between different domains
- Implement app verification
- User profiles/API to get user info if not included in the JWT content
- OpenID
- Kubernetes configuration
