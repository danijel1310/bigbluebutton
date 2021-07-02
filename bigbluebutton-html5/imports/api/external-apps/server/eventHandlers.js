import RedisPubSub from '/imports/startup/server/redis';
import handleStartDrawio from './handlers/startDrawio';

RedisPubSub.on('StartDrawioEvtMsg', handleStartDrawio); //StartDrawioEvtMsg