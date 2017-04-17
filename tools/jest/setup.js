require('jest-enzyme');
const { EventEmitter } = require('events');
const enzyme = require('enzyme');
const shallowToJson = require('enzyme-to-json');

global.shallow = enzyme.shallow;
global.render = enzyme.render;
global.mount = enzyme.mount;
global.shallowToJson = shallowToJson;
global.Promise = require('bluebird');
// Skip createElement warnings but fail tests on any other warning
console.error = message => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};

EventEmitter.defaultMaxListeners = Infinity;

global.Array = Array;
global.Date = Date;
global.Function = Function;
global.Math = Math;
global.Number = Number;
global.Object = Object;
global.RegExp = RegExp;
global.String = String;
global.Uint8Array = Uint8Array;
global.WeakMap = WeakMap;
global.Set = Set;
global.Error = Error;
global.TypeError = TypeError;
global.parseInt = parseInt;
global.parseFloat = parseFloat;
