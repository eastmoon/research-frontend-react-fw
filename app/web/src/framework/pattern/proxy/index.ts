/*
    Proxy pattern.

    ref : https://en.wikipedia.org/wiki/Proxy_pattern
    author: jacky.chen
*/
// Import libraries
import { Publisher } from "@/framework/pattern/observer";
// Declare interface
export interface IProxy {
    name : string;
    op($name: string, $args?: any) : any;
}

// Declare class
export class Service implements IProxy {
    // Member variable
    name : string;
    // Constructor
    constructor($name?: string | null) {
        // private variable, not safe way.
        this.name = $name ? $name : this.constructor.name;
    }

    // observer
    op($name : string, $args?: any) : any {
        let res : any = null;
        if ( this.constructor.prototype[$name] !== undefined && typeof this.constructor.prototype[$name] === "function" ) {
            let fun = this.constructor.prototype[$name].bind(this);
            res = fun($args);
        }
        return res;
    }
}

export class Proxy extends Publisher implements IProxy {
    // Member variable
    name : string;
    // Constructor
    constructor($name?: string | null) {
        // call parent class constructor.
        super();
        // private variable, not safe way.
        this.name = $name ? $name : this.constructor.name;
    }

    // observer
    op($name : string, $args?: any) : any {
        return new Promise<any>(async (resolve, reject) => {
            let res : any = null;
            try {
                if ( this.constructor.prototype[$name] !== undefined && typeof this.constructor.prototype[$name] === "function" ) {
                    let fun = this.constructor.prototype[$name].bind(this);
                    res = await fun($args);
                }
                if ( res !== null ) {
                    resolve(res);
                } else {
                    reject("Result object is null.");
                }
            } catch (error) {
                reject(`Operation failed : ${error}`);
            }
        })
    }
}
