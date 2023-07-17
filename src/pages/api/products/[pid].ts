/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type SessionContextProps } from 'types';
import { bigcommerceClient, getSession } from '~/../lib/auth';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    const { query: { pid }, method } = req;

    if (!pid || !method) {
        res.status(400).json({ message: 'Missing pid' });
        return;
    }

    const { accessToken, storeHash } = await getSession(req) as SessionContextProps;
    const bigcommerce = bigcommerceClient(accessToken, storeHash);

    try {
        switch (method) {
            case 'GET':
                const params = new URLSearchParams({ include: 'images' }).toString();
                const { data } = await bigcommerce.get(`/catalog/products/${pid.toString()}?${params}}`);

                res.status(200).json(data);
                break;
            case 'PUT':
                const { data: putData } = await bigcommerce.put(`/catalog/products/${pid.toString()}`, req.body);
                res.status(200).json(putData);
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        const { response, message } = error as { response?: { status?: number }, message?: string };

        res.status(response?.status ?? 500).json({ message });
    }
}
