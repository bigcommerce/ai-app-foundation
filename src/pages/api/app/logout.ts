
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession, logoutUser } from 'lib/auth';
import { type SessionContextProps } from 'types';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession(req.query?.context?.toString()) as SessionContextProps;

        await logoutUser(session);
        res.status(200).end();
    } catch (error) {
        const { response, message } = error as { response?: { status?: number }, message?: string };

        res.status(response?.status ?? 500).json({ message });
    }
}
