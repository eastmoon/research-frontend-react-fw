/*
Singleton pattern.

ref: https://en.wikipedia.org/wiki/Singleton_pattern
author: jacky.chen
*/

// Declare module variable
let instances : { [key: string]: Singleton } = {};

// Singleton class
export default class Singleton {
    // Declare constructor function
    constructor() {
        // Set object isn't first create
        // Make sure every time new object will be the same instance
        // In here, this is instance object.
        if (typeof instances[this.constructor.name] === "undefined" || instances[this.constructor.name] === null) {
            instances[this.constructor.name] = this;
        }
        return instances[this.constructor.name];
    }

    // Declare static accessor
    static get instance() : any {
        // Class.instance, use static attribute to retrieve instance
        if (typeof instances[this.name] === "undefined" || instances[this.name] === null) {
            instances[this.name] = new this();
        }
        return instances[this.name];
    }
}
