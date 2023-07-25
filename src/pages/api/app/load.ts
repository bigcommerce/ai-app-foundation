import { createAppExtension, getAppExtensions } from "lib/appExtensions";
import { encodePayload, getBCVerify, setSession } from "lib/auth";
import { type NextApiRequest, type NextApiResponse } from "next";
import * as db from 'lib/db';

const buildRedirectUrl = (url: string, encodedContext: string) => {
    const [path = '', query = ''] = url.split('?');

    const queryParams = new URLSearchParams(
        `context=${encodedContext}&${query}`
    );

    return `${path}?${queryParams.toString()}`;
};

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        const signedPayloadJwt = typeof req.query.signed_payload_jwt === 'string' ? req.query.signed_payload_jwt : '';

        const session = await getBCVerify(signedPayloadJwt);
        const encodedContext = encodePayload(session);
        const { url, sub } = session;

        const storeHash = sub?.split('/')[1] || '';

        const accessToken = await db.getStoreToken(storeHash);

        if (!accessToken) {
            throw new Error('Access token is not available. Please login or ensure you have access permissions.');
        }

        await setSession(session);

        /**
         * For stores that do not have app extensions installed yet, create app extensions when app is
         * loaded
         */

        const isAppExtensionsScopeEnabled = await db.hasAppExtensionsScope(storeHash);

        if (!isAppExtensionsScopeEnabled) {
            console.warn(
                "WARNING: App extensions scope is not enabled yet. To register app extensions update the scope in Developer Portal: https://devtools.bigcommerce.com");

            return res.redirect(302, buildRedirectUrl(url || '/', encodedContext));
        }

        const extensions = await getAppExtensions({ accessToken, storeHash });

        // If there are no app extensions returned, we assume we have not
        // installed app extensions on this store, so we must install them.

        if (!extensions.length) {
            await createAppExtension({ accessToken, storeHash });
        }

        res.redirect(302, buildRedirectUrl(url || '/', encodedContext));
    } catch (error) {
        const { response, message } = error as { response?: { status?: number }, message?: string };

        res.status(response?.status ?? 500).json({ message });
    }
}
