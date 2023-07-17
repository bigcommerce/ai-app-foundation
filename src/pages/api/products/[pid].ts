import { type NextApiRequest, type NextApiResponse } from 'next';
import { type SessionContextProps } from 'types';
import { bigcommerceClient, getSession } from '~/../lib/auth';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        query: { pid },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const { accessToken, storeHash } = await getSession(req) as SessionContextProps;
                const bigcommerce = bigcommerceClient(accessToken, storeHash);

                const params = new URLSearchParams({ include: 'images' }).toString();
                const { data } = await bigcommerce.get(`/catalog/products/${pid}?${params}}`);

                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        case 'PUT':
            try {
                const { accessToken, storeHash } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeHash);

                const { data } = await bigcommerce.put(`/catalog/products/${pid}`, body);
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
