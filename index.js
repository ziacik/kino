const container = require('electrolyte');

container.use(container.dir('src'));
container.use(container.node_modules());


container.create('app').then(app => app.run()).catch(console.error);
