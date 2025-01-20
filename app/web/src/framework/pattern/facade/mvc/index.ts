/*
    Application, main application system, using singleton-facade pattern.
    use it to retrieve Views, Models, Controllers.

    author: jacky.chen
*/
// Declare libraries
import Singleton from "@/framework/pattern/singleton";
import { IContainer, Container } from "@/framework/pattern/facade/container";
import { ICommand } from "@/framework/pattern/command";
import { IProxy } from "@/framework/pattern/proxy";
import { IMediator } from "@/framework/pattern/mediator";
import { IPublisher } from "@/framework/pattern/observer";

// Declare function
function isProps<T>(o : T, prop : string): o is T {
    return !!o && (!!o.hasOwnProperty(prop) || !!o.constructor.prototype[prop]);
}

// Singleton class
export default class Application extends Singleton {
    // Declaare member variable
    model : Container<IProxy>;
    view : Container<IMediator>;
    controller : Container<ICommand>;

    // Declare constructor
    constructor() {
        // call parent class constructor.
        super();
        // Initial container
        this.model = new Container<IProxy>();
        this.view = new Container<IMediator>();
        this.controller = new Container<ICommand>();
    }

    // Declare class method

    // register content
    // @return : true, register success. false, register fail or parameter input wrong.
    static register($content : any) : boolean {
        let self = Application.instance;
        if ($content !== null && $content !== undefined) {
            if ( isProps<IProxy>($content, "name") && isProps<IProxy>($content, "op") ) {
                return self.model.register($content.name, $content);
            }
            if ( isProps<IMediator>($content, "name") && isProps<IMediator>($content, "on") ) {
                return self.view.register($content.name, $content);
            }
            if ( isProps<ICommand>($content, "name") && isProps<ICommand>($content, "exec") ) {
                return self.controller.register($content.name, $content);
            }
        }
        return false;
    }

    // remove content
    // @return : true, remove success. false, remove fail or parameter input wrong.
    static remove($content : any) : boolean {
      let self = Application.instance;
      if ($content !== null && $content !== undefined) {
          if ( isProps<IProxy>($content, "name") && isProps<IProxy>($content, "op") ) {
              return self.model.remove($content.name);
          }
          if ( isProps<IMediator>($content, "name") && isProps<IMediator>($content, "on") ) {
              return self.view.remove($content.name);
          }
          if ( isProps<ICommand>($content, "name") && isProps<ICommand>($content, "exec") ) {
              return self.controller.remove($content.name);
          }
      }
      return false;
    }

    // Execute model operation
    static op($name : string, $operation : string, $args ?: any) : any {
        let self = Application.instance;
        let o : IProxy | null = self.model.retrieve($name);
        if ( o !== null ) {
            return o.op($operation, $args);
        }
        return null;
    }

    // Execute view event
    static on($name : string, $com : string, $event : string, $args ?: any) : void {
        let self = Application.instance;
        let o : IMediator | null = self.view.retrieve($name);
        if ( o !== null ) {
            o.on($com, $event, $args);
        }
    }

    // Execute controller command
    static exec($name : string, $args ?: any) : any {
        let self = Application.instance;
        let o : ICommand | null = self.controller.retrieve($name);
        if ( o !== null ) {
            return o.exec($args);
        }
        return $args;
    }

    // Execute model or view notify
    static notify($name : string, $event : string, $args ?: any) : void {
        let self = Application.instance;
        let m : any = self.model.retrieve($name);
        let v : any = self.view.retrieve($name);
        let p : IPublisher;
        if ( m !== null && isProps<IPublisher>(m, "notify")) {
            p = m;
            return p.notify($event, $args);
        }
        if ( v !== null && isProps<IPublisher>(v, "notify")) {
            p = v;
            return p.notify($event, $args);
        }
        return $args;
    }

    // Declare accessor
    // Static attribute, retrieve view container.
    static get view() : IContainer<IMediator> {
        return Application.instance.view;
    }
    // Static attribute, retrieve controller container.
    static get controller() : IContainer<ICommand> {
        return Application.instance.controller;
    }
    // Static attribute, retrieve model container.
    static get model() : IContainer<IProxy> {
        return Application.instance.model;
    }
    //
}
