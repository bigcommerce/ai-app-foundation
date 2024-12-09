# AI App Foundation

This [single-click app](https://developer.bigcommerce.com/api-docs/apps/guide/types) presents BigCommerce merchants with the ability to generate product descriptions. It's also listed in our app marketplace.

:star2: This was originally open sourced as part of the Google <> BigCommerce AI Hackathon. Check out that event's [hackpack](https://developer.bigcommerce.com/big-ai-hackathon-2023/welcome) for more detail on Vertex AI and BigCommerce App Extensions. :star2:

## Install

1. [Use Node 18+ and NPM 8+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js)
2. Install npm packages
   - `npm install`

## Usage

To run the app locally, follow these instructions:

1. [Add and start ngrok.](https://ngrok.com/download) _Note: use port 3000 to
   match Next's server._
   - `ngrok http 3000`
   - Get the `ngrok_id` from the **Forwarding** row. You will use it in the next step.
2. [Register a draft app.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#register-the-app)
   - Enter app callbacks using the following syntax:
     - Auth Callback URL: `https://{ngrok_id}.ngrok.app/api/app/auth`, for example `https://12345.ngrok.app/api/app/auth`
     - Load Callback URL: `https://{ngrok_id}.ngrok.app/api/app/load`
     - Uninstall Callback URL: `https://{ngrok_id}.ngrok.app/api/app/uninstall`
   - Configure the following OAuth scopes as directed in [Setup:](https://developer.bigcommerce.com/app-extensions/guide#setup)
     - App Extensions: Manage
     - Products: Manage
3. Copy `.env.example` to `.env`.
4. [Replace `CLIENT_ID` and `CLIENT_SECRET` in `.env`](https://devtools.bigcommerce.com/my/apps)
   (from `View Client ID` in the dev portal).
5. Enter a JWT secret in `.env`.
   - JWT key should be at least 32 random characters (256 bits) for HS256
6. [Replace FIRE_API_KEY, FIRE_DOMAIN and FIRE_PROJECT_ID in .env](https://developer.bigcommerce.com/api-docs/apps/tutorials/build-a-nextjs-sample-app/step-3-integrate#set-up-firebase-database)
7. Replace GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 in .env
   - [Create a service account](https://cloud.google.com/iam/docs/service-accounts-create)
   - [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete)
   - Download the result json file, base64 encode it and replace GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 in .env with the result string
8. Start your dev environment in a **separate** terminal from `ngrok`. If
   `ngrok` restarts, update callbacks in steps 2 and 5 with the new ngrok_id.
   - `npm run dev`
9. [Install the app and launch.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#install-the-app)

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbigcommerce%2Fai-app-foundation&env=CLIENT_ID,CLIENT_SECRET,APP_ORIGIN,AUTH_CALLBACK,JWT_KEY,FIRE_API_KEY,FIRE_DOMAIN,FIRE_PROJECT_ID,GOOGLE_API_KEY&envDescription=Doc%20for%20setting%20up%20ENV%20Variable&envLink=https%3A%2F%2Fdeveloper.bigcommerce.com%2Fapi-docs%2Fapps%2Ftutorials%2Fbuild-a-nextjs-sample-app%2Fstep-3-integrate%23set-up-firebase-database&project-name=ai-app-foundation&repository-name=ai-app-foundation)

## Contributing

Please feel free to ask questions or raise issues in GitHub Issues/Discussions.

## Security

To enhance security, include a CSRF token for sensitive actions (e.g., modifying product descriptions) or operations that might generate load or costs (such as AI prompts). This will provide an extra layer of protection and ensure proper authorization.

## Learn more

### The BigCommerce platform

Looking to help the world's leading brands and the next generation of successful merchants take flight? To learn more about developing on top of the BigCommerce platform, take a look at the following resources:

- [BigCommerce Developer Center](https://developer.bigcommerce.com/) - Learn more about BigCommerce platform features, APIs, and SDKs
- [BigDesign](https://developer.bigcommerce.com/api-docs/apps/guide/ui) - An interactive site for BigCommerce's React Components with live code editing
- [Building BigCommerce Apps](https://developer.bigcommerce.com/api-docs/apps/guide/intro) - Learn how to build apps for the BigCommerce marketplace
