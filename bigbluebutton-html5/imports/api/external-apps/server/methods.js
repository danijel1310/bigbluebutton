import { Meteor } from 'meteor/meteor';
import startShowingDrawio from './methods/startShowingDrawio';
import stopShowingDrawio from './methods/stopShowingDrawio';
import startShowingWekan from './methods/startShowingWekan';
import stopShowingWekan from './methods/stopShowingWekan';

Meteor.methods({
    startShowingDrawio,
    stopShowingDrawio,
    startShowingWekan,
    stopShowingWekan
});