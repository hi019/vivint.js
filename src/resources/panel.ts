import { makeRequest } from '../request';
import { API_URL } from '../constants';

export interface IPanel {
    id: number;
}

export class Panel implements IPanel {
    id: number;

    constructor(args: IPanel) {
        this.id = args.id;
    }

    async credentials() {
        const { data } = await makeRequest(`${API_URL}/api/panel-login/${this.id}`);
        return { username: data.n, pass: data.pswd };
    }
}

export async function getPanels(): Promise<Panel[]> {
    const { data } = await makeRequest(`${API_URL}/api/authuser`);

    const panels: Panel[] = [];

    for (const system of data['u']['system']) {
        panels.push(new Panel({ id: system.panid }));
    }

    return panels;
}
