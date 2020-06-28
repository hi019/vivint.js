import { makeRequest } from '../request';
import { API_URL } from '../constants';
import { Camera } from './camera';

export enum DEVICE_TYPES {
    CAMERA = 'camera_device',
}

export interface IEvent {
    me: string;
    did: number;
    hdt: string;
    ts: string;
}

export interface EventHistoryResponse {
    his: IEvent[];
}

export interface IEventHistory {
    before?: Date;
    after?: Date;
    limit?: number;
}

export interface IPanel {
    id: number;
}

/**
 * A panel event
 * @property me - the event message eg "The Front Door was opened"
 * @property did -
 */
export class Event {
    me: string;
    did: number;
    hdt: string;
    ts: Date;

    constructor(args: IEvent) {
        this.me = args.me;
        this.did = args.did;
        this.hdt = args.hdt;
        this.ts = new Date(args.ts);
    }
}

/**
 * A Vivint panel
 */
export class Panel implements IPanel {
    id: number;

    constructor(args: IPanel) {
        this.id = args.id;
    }

    async credentials() {
        const { data } = await makeRequest(`${API_URL}/api/panel-login/${this.id}`);
        return { username: data.n, pass: data.pswd };
    }

    async eventHistory(args?: IEventHistory) {
        const { data } = await makeRequest<EventHistoryResponse>(`${API_URL}/api/${this.id}/1/history`, {
            params: {
                be: args?.before?.toISOString(),
                after: args?.after?.toISOString(),
                lim: args?.limit,
            },
        });

        return data.his.map((event) => new Event(event));
    }

    async getDevices(types?: string[]): Promise<Camera[]> {
        const { data } = await makeRequest(`${API_URL}/api/systems/${this.id}`);

        const devices: any[] = data.system.par[0].d;

        const selectedDevices = devices.map((device) => {
            if (types?.includes(device.t)) {
                switch (device.t) {
                    case DEVICE_TYPES.CAMERA:
                        return new Camera(device);
                }
            }
        });

        // @ts-ignore
        return selectedDevices.filter((d) => d !== undefined);
    }
}
/**
 * Gets all of the currently logged in users panels
 */
export async function getPanels(): Promise<Panel[]> {
    const { data } = await makeRequest(`${API_URL}/api/authuser`);

    const panels: Panel[] = [];

    for (const system of data['u']['system']) {
        panels.push(new Panel({ id: system.panid }));
    }

    return panels;
}
