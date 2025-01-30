/*
    Mediator pattern.

    ref : https://en.wikipedia.org/wiki/Mediator_pattern
    author: jacky.chen
*/
// Import libraries
import { IContainer, Container } from "@/framework/pattern/facade/container";
import { TSubscriber, ISubscriber, IPublisher, Publisher } from "@/framework/pattern/observer";
// Declare interface
export interface IMediator extends IPublisher {
    name : string;
    attachEvent($name : string, $event : string, $handler : TSubscriber) : void;
    detachEvent($name : string, $event ?: string) : void;
    on($name : string, $event : string, $args : any) : Promise<void>;
    get count() : number;
    get names() : string[];
}
export interface IEvent extends ISubscriber {
    name : string;
}

// Declare class
export class Mediator extends Publisher implements IMediator {
    // Member variable
    name : string;
    protected components : { [ key : string ] : IContainer<TSubscriber>　} = {};
    // Constructor
    constructor($name?: string | null) {
        // call parent class constructor.
        super();
        // private variable, not safe way.
        this.name = $name ? $name : this.constructor.name;
    }

    // Declare class method
    attachEvent($name : string, $event : string, $handler : TSubscriber) : void {
        if ( this.components[$name] === undefined ) {
            this.components[$name] = new Container<TSubscriber>();
        }
        this.components[$name].register($event, $handler);
        this.attach($event, $handler);
    }
    detachEvent($name : string, $event ?: string) : void {
        if ( this.components[$name] !== undefined ) {
            let con : IContainer<TSubscriber> = this.components[$name];
            if ( $event === undefined ) {
                con.keys.forEach((key) =>{
                    let f : TSubscriber | null = con.retrieve(key);
                    if ( f !== null ) { this.detach(key, f); }
                })
                delete this.components[$name];
            } else {
                let f : TSubscriber | null = con.retrieve($event);
                if ( f !== null ) {
                    con.remove($event);
                    this.detach($event, f);
                    if ( con.size === 0 ) { delete this.components[$name]; }
                }
            }
        }
    }
    async on($name : string, $event : string, $args ?: any) : Promise<void> {
        if ( this.components[$name] !== undefined ) {
          let f : TSubscriber | null = this.components[$name].retrieve($event);
          if ( f !== null ) { await f($args); }
        }
    }

    // Declare accessor
    // count
    // A number with how many components in mediator.
    // @return : content count.
    get count() : number {
        return Object.keys(this.components).length;
    }

    // names
    // An array with all component name which attach in mediator.
    // @return : all content key name.
    get names() : string[] {
        return Object.keys(this.components);
    }
}
