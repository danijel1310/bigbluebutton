import { Meteor } from 'meteor/meteor';
import startShowingDrawio from './methods/startShowingDrawio';
import stopShowingDrawio from './methods/stopShowingDrawio';

Meteor.methods({
    startShowingDrawio,
    stopShowingDrawio,
});