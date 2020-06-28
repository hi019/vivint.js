export type VivintConfig = {
    username: string;
    password: string;
};

export type AuthConfig = {
    oauth_state: string;
    oidc_nonce: string;
    id_token?: string;
};

export interface Camera {
    cous: string;
    ceu: string[];
    cetus: string[];
    pswd: string;
    cia: string;
    ciu: string[];
    cea: string;
    cius: string[];
    name: string;
}
