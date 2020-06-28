import * as Vivint from '../src'; // In your code, import from `vivint.js` instead
import { DEVICE_TYPES } from '../src';
import colors from 'colors';

const main = async () => {
    await Vivint.login('username', 'pass');
    const panels = await Vivint.getPanels();

    const { username, pass } = await panels[0].credentials();
    const cameras = await panels[0].getDevices([DEVICE_TYPES.CAMERA]);

    const possiblePanelIp = cameras[0].cia.split('/')[2].slice(0, -5);

    cameras.forEach((camera) => {
        const localUrl = `rtsp://${username}:${pass}@${camera.cous.slice(7)}`;
        const globalUrl = `rtsp://${username}:${pass}@${camera.ceu[0].slice(7)}`;

        console.log(colors.green.bold(camera.n));
        console.log(colors.green('Local Feed'), localUrl);
        console.log(colors.green('Global Feed'), globalUrl);

        console.log();
    });

    console.log(colors.bgYellow.black('NOTE'), 'You can get an HD stream by removing _SD from the end of each URL');
    console.log(
        colors.bgYellow.black('NOTE'),
        `If you get an error when trying to connect to a local feed, first make sure the panel ip is correct. ${colors.bold.underline(
            'Another possible panel IP is ' + possiblePanelIp,
        )}`,
    );
};

main();
