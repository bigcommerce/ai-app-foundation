/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getBCVerify, removeDataStore } from 'lib/auth';
import { type QueryParams } from 'types';

export default async function uninstall(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query as QueryParams);

        await removeDataStore(session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        console.log(message, response);
        res.status(response?.status || 500).json({ message, here: 'here' });
    }
}
