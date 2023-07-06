/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getBCAuth, encodePayload, setSession } from 'lib/auth';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Authenticate the app on install
        if (req.query) {
            const session = await getBCAuth(req.query);
            console.log(session);
            const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

            setSession(session);
            res.redirect(302, `/?context=${encodedContext}`);
        }
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message, here: 'here' });
    }
}
