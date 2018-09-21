# Bookclub

A webapp to track books members are interested in, and vote on which book to choose next.

## Setup

How to set up the application locally for development.

### Prerequisites

You'll need the following tools on your machine:

- [Mongo DB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- *[Node](https://nodejs.org/en/download/)
- [concurrently](https://www.npmjs.com/package/concurrently) as a global user (`npm i -g concurrently`)
- **A Google API project with OAuth2 credentials

\* I actually recommend installing [NVM](https://github.com/creationix/nvm), and then running the command `nvm i stable`. Much easier, and allows you to switch between Node versions later.

\** If you get the local ENV files from an Admin, you can use the pre-built project & associated keys. Otherwise, follow these steps to set it up in [Appendix A. Setting up a Google API Project with Oauth](#a-setting-up-a-google-api-project-with-oauth)

### Getting Started

#### Getting the code

Clone the project into your local machine.

#### Initialization

In the project directory, run the init script:

    $ npm i

#### Environment variables

The project's environment variables are all stored in the `shared/@env` directory. Included in the project are the basic configs for `local-*`. Some fields (shown below) will need updating. Ask an admin for staging or production configs.

In `@env/local-server.ts`, the following ENV variables will need updating from their default state:

- `GOOGLE_AUTH_CLIENT_ID`
- `GOOGLE_AUTH_CLIENT_SECRET`

In `@env/shared-server.ts`, the following ENV variable will need updating from its default state:

- `BOOKSCRAPS_API_KEY`

Check out [Appendix A. Setting up a Google API Project with Oauth](#a-setting-up-a-google-api-project-with-oauth), or contact an admin, if you need help getting these keys.

### Running & Viewing

Open two terminal tabs. One in `./server` and one in `./client`. Run the following command in both tabs:

    $ npm start

Default port for local is `3000`. Navigate to `http://localhost:3000` in your browser, and you should see the application running.

## Contributing

### Opening Issues

Feel free to open new issues if you have a feature request or discover a bug. If you do find a bug, the more reproduction steps you can provide, the better!

### Authoring Guidelines

If you want to contribute, try to follow these guidelines to make it smoother.

1. Create a new branch
2. Write your code
3. Open a Pull Request, and include these details:
    - Experience changes, if any (What will the user see differently. Provide screenshots if necessary.)
    - Describe the code changes

## Appendix

### A. Setting up a Google API Project with Oauth

1. https://console.developers.google.com/
2. Click `Select a project` (Top Left)
3. Click `NEW PROJECT` (Top Right)
4. Fill out Project Name, Organization, and Location as you see fit. These have no impact on this project.
5. Click `Create`
6. Ensure you're on the `Credentials` tab, if not - click it.
7. Open `Create Credentials` dropdown (Blue button, center)
8. Click `OAuth client ID`
9. Select `Web application`
10. Under `Authorized JavaScript origins`, add `http://localhost`
11. Under `Authorized redirect URIs`, add these:
    * `http://localhost/oauth2callback`
    * `http://localhost/auth/google/callback`
    * `http://localhost/auth/google`
12. Click `Create`
13. Copy your `Client ID` and `Client Secret` into their appropriate `GOOGLE_AUTH_*` fields under `@env/server-local.ts`

### B. Node Env Variables used in Bookclub

- PORT: the port to run on, most env configs default this to 3000
- ENV: the environment to target for the current run/build
    * _local_ - local environment, minimal safety checks or auth
    * _staging_ - staging environment, all production safety and auth, but a separate environment to play with
    * _production_ - production environment. This is what people actually see and use.

Set these by prepending them to any task. eg: `ENV=production PORT=1234 node ./dist/run.js`