# Control Panel AI app

This is
[single-click app](https://developer.bigcommerce.com/api-docs/apps/guide/types)
which presents BigCommerce merchants with the ability to generate product
descriptions.

## Install

1. [Use Node 18+ and PNPM 8+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js)
2. Install npm packages
   - `pnpm install`

## Usage

To run the app locally, follow these instructions:

1. [Add and start ngrok.](https://ngrok.com/download) _Note: use port 3000 to
   match Next's server._
   - `ngrok http 3000`
2. [Register a draft app.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#register-the-app)
   - Enter app callbacks as
     `https://{ngrok_id}.ngrok.app/api/{install||load||uninstall}`.
   - Get `ngrok_id` from the terminal that's running `ngrok http 3000`.
   - e.g. auth callback: `https://12345.ngrok.app/api/install`
3. Copy `.env.example` to `.env`.
4. [Replace BC_CLIENT_ID and BC_CLIENT_SECRET in .env](https://devtools.bigcommerce.com/my/apps)
   (from `View Client ID` in the dev portal).
5. Update `BC_OAUTH_REDIRECT` in `.env` with the Ngrok `install` callback URL.
6. Specify DB_TYPE in .env
    firebase or mysql
    If using Firebase, enter your firebase config keys. See Firebase quickstart
    If using MySQL, enter your mysql database config keys (host, database, user/pass and optionally port). If not using the heroku deploy button above, you will now want to run npm run db:setup to perform the initial database setup. Note: if using Heroku with ClearDB, the DB should create the necessary Config Var, i.e. CLEARDB_DATABASE_URL.
7. Start your dev environment in a **separate** terminal from `ngrok`. If
   `ngrok` restarts, update callbacks in steps 2 and 5 with the new ngrok_id.
   - `npm run dev`
8. [Install the app and launch.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#install-the-app)

### Environment Variables

Both the `lib/env.server.ts` and `lib/env.client.ts` files validate and strongly
type environment variables at run time for use throughout your application. When
you add a new server environment variable in your `.env` or `.env.local` file,
add the variable in the `serverSchema` object in `lib/env.server.ts`; when you
add a new client environment variable to your `.env` or `.env.local` file, add
the variable in the `clientSchema` object in `lib/env.client.ts`.

## Contributing

Please feel free to ask questions or raise issues in GitHub Issues/Discussions.
