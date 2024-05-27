import { Response, Request, Headers } from '@whatwg-node/fetch';

global.Response = Response;
global.Request = Request;
global.Headers = Headers;
