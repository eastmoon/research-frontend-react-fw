/*
    Obserever pattern.

    ref : https://en.wikipedia.org/wiki/Observer_pattern
    author: jacky.chen
*/
// Import libraries
import { Container } from "@/framework/pattern/facade/container";
// Declare type
export type TSubscriber = ($args ?: any) => void
// Declare interface
export interface ISubscriber {
    subject : string;
    handler : TSubscriber;
}
export interface ISubject {
    attach($handler : TSubscriber ) : void;
    detach($handler : TSubscriber ) : void;
    notify($note ?: any) : void;
    get size() : number;
}
export interface IPublisher {
    attach($subject : string, $handler : TSubscriber ) : void;
    detach($subject : string, $handler : TSubscriber ) : void;
    subscribe($subscriber : ISubscriber) : void;
    unsubscribe($subscriber : ISubscriber) : void;
    notify($subject : string, $note ?: any) : void;
}
// Declare class
export class Subject implements ISubject {
    // Declaare member variable
    protected subscribes : TSubscriber[] = [];

    // Declare class method
    attach($handler : TSubscriber ) : void {
        let index = this.subscribes.indexOf($handler);
        if ( index === -1 ) {
            this.subscribes.push($handler);
        }
    }
    detach($handler : TSubscriber ) : void {
        let index = this.subscribes.indexOf($handler);
        if ( index !== -1 ) {
            this.subscribes.splice(index, 1);
        }
    }
    notify($note ?: any) : void {
        this.subscribes.forEach(($fun : TSubscriber) => $fun($note));
    }

    // Declare accessor
    get size() : number {
      return this.subscribes.length;
    }
}

export class Publisher extends Container<ISubject> implements IPublisher {
    // Declare class method
    attach($subject : string, $handler : TSubscriber ) : void {
        if ( !this.has($subject) ) {
            this.register($subject, new Subject());
        }
        let s : ISubject | null = this.retrieve($subject);
        if ( s !== null ) {
            s.attach($handler);
        }
    }
    detach($subject : string, $handler : TSubscriber ) : void {
        let s : ISubject | null = this.retrieve($subject);
        if ( s !== null ) {
            s.detach($handler);
            if (s.size === 0) {
                this.remove($subject)
            }
        }
    }
    subscribe($subscriber : ISubscriber) : void {
        this.attach($subscriber.subject, $subscriber.handler);
    }
    unsubscribe($subscriber : ISubscriber) : void {
        this.detach($subscriber.subject, $subscriber.handler);
    }
    notify($subject : string, $note ?: any) : void {
        let s : ISubject | null = this.retrieve($subject);
        if ( s !== null ) {
            s.notify($note);
        }
    }
}
