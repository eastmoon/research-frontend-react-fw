/*
Command pattern.

ref: https://en.wikipedia.org/wiki/Command_pattern
author: jacky.chen
*/
import { Container } from "@/framework/pattern/facade/container";

// Declare interface
export interface ICommand {
    name : string;
    exec($args?: any) : any;
}

// Declare class
export class Simple implements ICommand {
    // Member variable
    name : string;
    // Constructor
    constructor($name?: string | null) {
        // private variable, not safe way.
        this.name = $name ? $name : this.constructor.name;
    }

    // execute
    // Execute algorithm in this object.
    exec($args?: any) : any {
        // Do nothing, return args.
        return $args;
    }
}

export class Macro extends Container<ICommand> implements ICommand {
    // Member variable
    name : string;
    // Constructor
    constructor($name?: string | null) {
        // call parent class constructor.
        super();
        // private variable, not safe way.
        this.name = $name ? $name : this.constructor.name;
    }

    // execute
    // Execute algorithm in this object.
    exec($args?: any) : any {
      // Order execute command in contents..
      // functional :
      Object.keys(this.contents).sort().forEach((key : string) => {
          let c : ICommand = this.contents[key];
          c.exec($args);
      })
      return $args;
    }
}
