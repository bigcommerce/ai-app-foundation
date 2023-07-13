import { type NextApiRequest, type NextApiResponse } from 'next';
import { getBCVerify, removeDataStore } from 'lib/auth';

export default async function uninstall(req: NextApiRequest, res: NextApiResponse) {
    try {
        const signedPayloadJwt = typeof req.query.signed_payload_jwt === 'string' ? req.query.signed_payload_jwt : '';

        const session = await getBCVerify(signedPayloadJwt);

        await removeDataStore(session);
        res.status(200).end();
    } catch (error) {
        const { response, message } = error as { response?: { status?: number }, message?: string };

        res.status(response?.status ?? 500).json({ message });
    }
}
