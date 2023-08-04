# AI App Foundation

This [single-click app](https://developer.bigcommerce.com/api-docs/apps/guide/types) presents BigCommerce merchants with the ability to generate product descriptions.

:star2: If you are hacking right now in the Google <> BigCommerce AI Hackathon event, check out our [Hackpack](https://developer.bigcommerce.com/big-ai-hackathon-2023/welcome) for more detail on Vertex AI and BigCommerce App Extensions! :star2:

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
3. Copy `.env.example` to `.env`.
4. [Replace `BC_CLIENT_ID` and `BC_CLIENT_SECRET` in `.env`](https://devtools.bigcommerce.com/my/apps)
   (from `View Client ID` in the dev portal).
5. Update `BC_OAUTH_REDIRECT` in `.env` with the ngrok `install` callback URL.
6. Enter a JWT secret in `.env`.
    - JWT key should be at least 32 random characters (256 bits) for HS256
7. [Replace FIRE_API_KEY, FIRE_DOMAIN and FIRE_PROJECT_ID in .env]([https://console.firebase.google.com](https://developer.bigcommerce.com/api-docs/apps/tutorials/build-a-nextjs-sample-app/step-3-integrate#set-up-firebase-database))
8. [Replace GOOGLE_API_KEY= in .env](https://cloud.google.com/docs/authentication/api-keys)
9. Start your dev environment in a **separate** terminal from `ngrok`. If
   `ngrok` restarts, update callbacks in steps 2 and 5 with the new ngrok_id.
   - `npm run dev`
10. [Install the app and launch.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#install-the-app)

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbigcommerce%2Fai-app-foundation&env=CLIENT_ID,CLIENT_SECRET,APP_ORIGIN,AUTH_CALLBACK,JWT_KEY,FIRE_API_KEY,FIRE_DOMAIN,FIRE_PROJECT_ID,GOOGLE_API_KEY&envDescription=Doc%20for%20setting%20up%20ENV%20Variable&envLink=https%3A%2F%2Fdeveloper.bigcommerce.com%2Fapi-docs%2Fapps%2Ftutorials%2Fbuild-a-nextjs-sample-app%2Fstep-3-integrate%23set-up-firebase-database&project-name=ai-app-foundation&repository-name=ai-app-foundation)

## Contributing

Please feel free to ask questions or raise issues in GitHub Issues/Discussions.

## Learn more

### The BigCommerce platform

Looking to help the world's leading brands and the next generation of successful merchants take flight? To learn more about developing on top of the BigCommerce platform, take a look at the following resources:

- [BigCommerce Developer Center](https://developer.bigcommerce.com/) - Learn more about BigCommerce platform features, APIs, and SDKs
- [BigDesign](https://developer.bigcommerce.com/api-docs/apps/guide/ui) - An interactive site for BigCommerce's React Components with live code editing
- [Building BigCommerce Apps](https://developer.bigcommerce.com/api-docs/apps/guide/intro) - Learn how to build apps for the BigCommerce marketplace

## License

Copyright (c) 2017-present, BigCommerce Pty. Ltd. All rights reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
