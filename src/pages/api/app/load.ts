/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { encodePayload, getBCVerify, setSession } from 'lib/auth';
import { type QueryParams } from 'types';

const buildRedirectUrl = (url: string, encodedContext: string) => {
    const [path = '', query = ''] = url.split('?');
    const queryParams = new URLSearchParams(`context=${encodedContext}&${query}`);

    return `${path}?${queryParams.toString()}`;
}

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify when app loaded (launch)
        const session = await getBCVerify(req.query as QueryParams);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        await setSession(session);
        res.redirect(302, buildRedirectUrl(session.url, encodedContext));
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
