const container = require('electrolyte');

container.use(container.dir('src'));
container.use(container.node_modules());

/* eslint-disable no-console */
container.create('app').then(app => app.run()).catch(console.error);
/* eslint-enable no-console */
