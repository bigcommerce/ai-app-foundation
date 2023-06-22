# Product Description Generator App

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
6. Enter `DATABASE_URL` in `.env`
   - In order to create a CDVM database and create the initial database tables
     defined in `prisma/schema.prisma`:
   - Ensure you have an active db cluster
   - Run `mysql -h cdvm -P 3306 -u root -p --protocol tcp` using a MySQL CLI
     Client
     ([`mysql-client` on Homebrew](https://formulae.brew.sh/formula/mysql-client))
   - Create a development database: `CREATE DATABASE desc_generator_app_dev`
   - Replace the `DATABASE` portion of the `DATABASE_URL` in your `.env` file
     with the database's name you created above (e.g., `desc_generator_app_dev`)
   - In the `catalyst-cp-app` repository root directory, run
     `npx prisma db push` to push the tables defined in `prisma/schema.prisma`
     to the newly created database
   - _**Note:** These steps will be taken care of in production by using
     [Prisma Migrate](https://www.prisma.io/docs/guides/deployment/deploy-database-changes-with-prisma-migrate)_
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

### Prisma Studio

As long as you have a valid `DATABASE_URL` in your `.env` file, you can run
`npx prisma studio` in your terminal to open up
[Prisma Studio](https://www.prisma.io/studio), a graphical web interface to
interact with and explore your app's data.

## Contributing

Please feel free to ask questions or raise issues in GitHub Issues/Discussions.
