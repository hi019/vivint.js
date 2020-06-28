import * as Vivint from 'vivint.js';
import colors from 'colors';

const main = async () => {
    await Vivint.login('username', 'pass');
    const panels = await Vivint.getPanels();

    const { username, pass } = await Vivint.getPanelPassword(panels[0].id);
    const cameras = await Vivint.getCameras(panels[0].id);

    console.log(
        colors.bgYellow.black.bold('NOTE'),
        'To atually get an RTSP stream with these values, see https://github.com/hi019/vivintjs/wiki/test/_edit', // TODO update link
    );

    console.log();

    console.log(colors.green.bold('------ RTSP STREAM INFO ------'));
    console.log(`Username: ${username}`);
    console.log(`Password: ${pass}`);

    console.log();

    console.log(colors.green.bold('------ DEVICES ------'));
    console.log(cameras);
};

main();
