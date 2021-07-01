import RedisPubSub from '/imports/startup/server/redis';
import handleStartDrawio from './handlers/startDrawio';

console.log('EVENTHANDLER');
RedisPubSub.on('StartDrawioEvtMsg', handleStartDrawio);