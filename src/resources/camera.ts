import { makeRequest } from '../request';
import { API_URL } from '../constants';
import { GenericDevice } from './generic';

export interface ICamera extends GenericDevice {
    cous: string;
    ceu: string[];
    cetus: string[];
    pswd: string;
    cia: string;
    ciu: string[];
    cea: string;
    cius: string[];
    n: string;
}

export class Camera implements ICamera {
    cous: string;
    ceu: string[];
    cetus: string[];
    pswd: string;
    cia: string;
    ciu: string[];
    cea: string;
    cius: string[];
    n: string;
    t: string;
    panid: number;

    // if only we had object initalizers...
    constructor(props: ICamera) {
        this.cous = props.cous;
        this.ceu = props.ceu;
        this.cetus = props.cetus;
        this.pswd = props.pswd;
        this.cia = props.cia;
        this.ciu = props.ciu;
        this.cea = props.cea;
        this.cius = props.cius;
        this.n = props.n;
        this.t = props.t;
        this.panid = props.panid;
    }
}

export async function getCameras(panelId: number): Promise<Camera[]> {
    const { data } = await makeRequest(`${API_URL}/api/systems/${panelId}`);

    const devices: any[] = data.system.par[0].d;

    const cameras = devices.map((device) => {
        if (device.t === 'camera_device') {
            return new Camera(device);
        }
    });

    // @ts-ignore
    return cameras.filter((d) => d !== undefined);
}
