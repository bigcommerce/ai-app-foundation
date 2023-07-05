/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession, logoutUser } from 'lib/auth';
import { type SessionContextProps } from 'types';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession(req) as SessionContextProps;

        await logoutUser(session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
