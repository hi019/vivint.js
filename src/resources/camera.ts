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
    id: number;

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

        // Extract camera id from audio url (camera id is used for things like retrieving streams)
        try {
            const cameraId = this.cea.match(/\d+/);
            if (cameraId === null) throw new Error('Could not extract camera ID from cea');
            this.id = Number(cameraId[0]);
        } catch (e) {
            throw new Error(`Could not extract camera ID (cea: ${this.cea}): ${e}`);
        }
    }

    async getThumbnail() {
        const { headers: thumbRequestHeaders } = await makeRequest(
            `${API_URL}/api/${this.panid}/1/${this.id}/request-camera-thumbnail`,
        );

        const { headers } = await makeRequest(`${API_URL}/api/${this.panid}/1/${this.id}/camera-thumbnail`, {
            validateStatus: (s) => true,
            maxRedirects: 0,
        });

        return headers['location'];
    }
}
