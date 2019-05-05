import basicAuth from './../middleware/auth';

const routes = {
  init: app => {
    app.use(basicAuth);

    app.get('/', (request, response) => {
      response.status(200).send(`Home`);
    });

    app.get('*', (request, response) => {
      response.status(404).send(`This page was not found`);
    });
  },
};

export default routes;
