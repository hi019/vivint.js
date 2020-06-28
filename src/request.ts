import axios, { AxiosRequestConfig } from 'axios';
import { API_URL, AUTH_URL } from './constants';
import { randomString } from './utils';
import qs from 'qs';

const oauth_state = randomString(32);
const oidc_nonce = randomString(32);
let id_token: string;

async function getClientId(): Promise<string> {
    const { data }: { data: string } = await axios.get(`${API_URL}/app/scripts/app.js`);
    const match = /r="id_token",a="([0-9a-f]*)"/.exec(data);
    if (match === null) throw new Error('Could not find client_id');
    return match[1];
}

export async function login(username: string, password: string) {
    const clientId = await getClientId();

    // GET the actual login form
    const res = await axios.get(`${AUTH_URL}/as/authorization.oauth2`, {
        params: {
            client_id: clientId,
            response_type: 'id_token',
            scope: 'openid email',
            redirect_uri: `${AUTH_URL}/app/`,
            pfidpadapterid: 'vivintidp1',
            nonce: oidc_nonce,
            state: `replay:${oauth_state}`,
        },
        headers: {
            Referer: `${AUTH_URL}/app/`,
            'User-Agent': 'vivintjs',
        },
    });

    const pfToken = res.headers['set-cookie'][0].match(/PF=([^;]*)/)[1];
    const apiId = res.data.match(/\/as\/([^/]*)\/resume\/as\/authorization.ping/gm)[0];

    const loginUrl = `${AUTH_URL}${apiId}`;

    // Login
    const loginRes = await axios.post(
        loginUrl,
        qs.stringify({
            'pf.username': username,
            'pf.pass': password,
        }),
        {
            headers: {
                'User-Agent': 'vivintjs',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                Referer: AUTH_URL,
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: AUTH_URL,
                DNT: 1,
                Connection: 'keep-alive',
                Cookie: `PF=${pfToken}; customer=1; oauth_state=${oauth_state}; oidc_nonce=${oidc_nonce}`,
            },
            maxRedirects: 0,
            // Usually axios throws an error for return code 302. But in this case, a 302 is what we want
            validateStatus: (status) => status >= 200 || status === 302,
        },
    );

    if (!loginRes.headers['location']) throw new Error('INVALID_CREDENTIALS');

    // id_token is a JWT used for authentication
    id_token = loginRes.headers['location'].match(/id_token=(.*(?=&))/)[1];
}

export async function makeRequest(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, {
        ...config,
        headers: {
            Cookies: `oauth_state=${oauth_state}; oidc_nonce=${oidc_nonce}; id_token=${id_token}`,
            Authorization: `Bearer ${id_token}`,
        },
    });
}
