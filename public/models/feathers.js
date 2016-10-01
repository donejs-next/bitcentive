import Feathers from 'can-connect-feathers';

const feathers = new Feathers({
  // The URL of the Feathers API server.
  url: '',
  // The default `idProp` for all services.
  idProp: '_id',
  // The key name of the location where the token will be stored.
  tokenLocation: 'feathers-jwt',
  // The endpoint for token authentication.
  tokenEndpoint: 'auth/token',
  // The endpoint for username/password authentication.
  localEndpoint: 'auth/local',
  // Set to false to disable socketio and force any socketio services to switch to rest.
  allowSocketIO: false
});

export default feathers;
