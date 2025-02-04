/*
    progress is a framework based on Pipe and Filter architecture.
    Pipe and Filter based on command design pattern.

    author: jacky.chen
*/
// Declare libraries
import { ICommand, Command, AsyncMacro } from "@/framework/pattern/command";
import { IContainer } from "@/framework/pattern/facade/container";
import { TSubscriber, ISubscriber, IPublisher, Publisher } from "@/framework/pattern/observer";

// Declare function
function isProps<T>(o : T, prop : string): o is T {
    return !!o && (!!o.hasOwnProperty(prop) || !!o.constructor.prototype[prop]);
}

// Declare Type
export type TPipeBlueprint = { [key : string] : string | string [] };
export type TPipeBlueprintOptions = { [ key : string ] : string };

// Declare interface
export interface IFilter extends ICommand {
    exec($args : any) : Promise<any>
}
export interface IPipe extends ICommand, IContainer<ICommand> {
    blueprint($bp : TPipeBlueprint, $bpo ?: TPipeBlueprintOptions) : void;
    exec($args : any) : Promise<any>
}
export interface IPipeController {
    goto ?: string;
    fail ?: boolean;
    data ?: any;
}
export interface IProgressNotify {
    progress : Progress;
    args ?: any;
    result ?: any;
}

// Declare class
export class Filter extends Command implements IFilter {}

class PipeNode {
    input : string[] = [];
    output : string[] = [];
    result : any = null;
    option : string = "or";
}

export class Pipe extends AsyncMacro implements IPipe {
    // Declare member variable
    private bp ?: TPipeBlueprint;
    private bpo ?: TPipeBlueprintOptions;
    private nodes : { [ key : string ] : PipeNode } = {};
    private execQueue : string[] = [];
    private execController ?: IPipeController;
    private execArgs ?: any;
    private execFail ?: IPipeController;

    // Declare class method
    blueprint($bp : TPipeBlueprint, $bpo ?: TPipeBlueprintOptions) : void {
        let entrypoint : any = $bp["in"];
        if ( !!entrypoint ) {
            this.bp = $bp;
            this.bpo = $bpo;
            //
            Object.keys(this.bp).forEach(name => {
                if ( this.nodes[name] === undefined ) { this.nodes[name] = new PipeNode(); }
                let bp : any = $bp[name];
                let node : PipeNode = this.nodes[name];
                if (!!bp && !!node) {
                    if ( typeof bp === "string" ) bp = [bp];
                    node.output = bp;
                }
            });
            //
            Object.keys(this.nodes).forEach(name => {
                let i : string[] = [];
                if (name === "in") name = "out";
                Object.keys(this.nodes).forEach(iname => {
                    let inode : PipeNode = this.nodes[iname];
                    if ( !!inode && inode.output.includes(name)) {
                        i.push(iname);
                    }
                });
                if ( this.nodes[name] === undefined ) { this.nodes[name] = new PipeNode(); }
                let node : PipeNode = this.nodes[name];
                if (!!node) { node.input = i }
            });
            //
            if ( !!this.bpo ) {
                Object.keys(this.bpo).forEach(name => {
                    let node : PipeNode = this.nodes[name];
                    if (!!node && !!this.bpo) { node.option = this.bpo[name]; }
                });
            }
        }
    }

    override async exec($args : any) : Promise<any> {
        // If blueprint was not exist, create sequence nodes structure with contents.
        this.initialNodesWithoutBuleprint();
        // Remove execute queue
        this.clearExecQueue();
        // Remove nodes legacy result.
        Object.keys(this.nodes).forEach((noden) => {
            if ( !!this.nodes[noden] ) { this.nodes[noden].result = null; }
        });
        // Execute flow with nodes structure.
        /// Insert args into "in" result
        let node : PipeNode = this.nodes["in"];
        if (!!node) { node.result = $args; }
        /// Start queue at "in"
        this.execQueue.push("in");
        do {
            // Pop node name and exec it.
            let noden : string | undefined = this.execQueue.pop();
            if ( !!noden ) { await this.execNode(noden); }
            // If have pipe controller, process it.
            this.processPipeController();
        } while( this.execQueue.length > 0 )
        return !!this.execFail ? this.execFail : this.processInputArgs("out");
    }

    private initialNodesWithoutBuleprint() : void {
        if (!!!this.bp) {
            let upnoden : string;
            let upnode : PipeNode;
            let node : PipeNode;
            let keys : string[] = ["in"].concat(Object.keys(this.contents).sort());
            keys.push("out");
            keys.forEach((key : string) => {
                if ( this.nodes[key] === undefined ) { this.nodes[key] = new PipeNode(); }
                node = this.nodes[key];
                if (!!node) {
                    if (!!upnoden) {
                        node.input = [upnoden];
                        upnode = this.nodes[upnoden];
                        if (!!upnode) { upnode.output = [key]; }
                    }
                    upnoden = key;
                }
            })
        }
    }

    protected clearExecQueue() : void {
        if ( this.execQueue.length > 0 ) {
            let tmp : string[] = this.execQueue;
            this.execQueue = [];
            tmp.length = 0;
        }
    }

    protected async execNode( $nodeName : string ) {
        let node : PipeNode = this.nodes[$nodeName];
        if (!!node) {
            node.output.forEach(($tnodeName : string) => {
                this.execQueue.push($tnodeName)
            });
            if ( $nodeName !== "out" ) {
                // Retrieve target node information object and filter object.
                let content : ICommand | null = this.retrieve($nodeName);
                let args : any = this.processInputArgs($nodeName);
                let isStop : boolean = false;
                // Check "and" option
                if ( !!node && node.option === "and" ) {
                    Object.keys(args).forEach(key => {
                        if (!!!args[key]) { isStop = true; }
                    });
                }
                // Execute filter
                if ( !isStop && !!content && !!node ) {
                    let res : any = await content.exec({...args});
                    if ( isProps<IPipeController>(res, "goto") ) {
                        // Result is Pipe controller and with goto other node.
                        this.execController = res;
                    } else if ( isProps<IPipeController>(res, "fail") ) {
                        // Result is Pipe controller and filter was failed.
                        if ( isProps<IPipeController>(res, "data") ) {
                            if (typeof res.data === "object")
                                this.execController = { fail: true, data: `[ Filter ] : ${JSON.stringify(res.data)}` }
                            else
                                this.execController = { fail: true, data: `[ Filter ] : ${res.data}` }
                        } else {
                            this.execController = { fail: true, data: `[ Filter ] : ${$nodeName} was retrun failed.` }
                        }
                    } else {
                        // Resulte is data.
                        node.result = res;
                    }
                }
            }
        }
        else {
            this.execController = { fail: true, data: `[ Pipe ] : Can't find '${$nodeName}' node information.` }
        }
    }

    protected processInputArgs($nodeName : string) : any {
        let node : PipeNode = this.nodes[$nodeName];
        let out : any = {};
        if (!!this.execArgs) {
            out = {...this.execArgs};
            this.execArgs = undefined;
        } else if (!!node) {
            if (node.input.length === 1) {
                let tnode : PipeNode = this.nodes[node.input[0]];
                if (!!tnode) { out = tnode.result; }
            } else if (node.input.length > 1) {
                node.input.forEach(($inodeName : string) => {
                    let tnode : PipeNode = this.nodes[$inodeName];
                    if (!!tnode) { out[$inodeName] = tnode.result; }
                });
            }
        }
        return out;
    }

    protected processPipeController() : void {
        if ( !!this.execController ) {
            let pc : IPipeController = this.execController;
            if ( !!pc && !!pc.goto ) {
                // Clear queue and push target node name
                this.clearExecQueue();
                this.execQueue.push(pc.goto);
                // Setting queue args object
                this.execArgs = pc.data;
            } else if (!!pc && !!pc.fail) {
                // Clear queue
                this.clearExecQueue();
                // Save fail object
                this.execFail = pc;
            }
            this.execController = undefined;
        }
    }
}

export class Progress extends Pipe implements IPublisher {
    // Declaare member variable
    publisher : IPublisher = new Publisher();

    // Declare class method
    attach($subject : string, $handler : TSubscriber ) : void {
        this.publisher.attach($subject, $handler);
    }
    detach($subject : string, $handler : TSubscriber ) : void {
        this.publisher.detach($subject, $handler);
    }
    subscribe($subscriber : ISubscriber) : void {
        this.publisher.subscribe($subscriber);
    }
    unsubscribe($subscriber : ISubscriber) : void {
        this.publisher.unsubscribe($subscriber);
    }
    notify($subject : string, $note ?: any) : void {
        this.publisher.notify($subject, $note);
    }
    override async exec($args : any) : Promise<any> {
        let note : IProgressNotify = {
            progress: this,
            args: $args
        }
        this.notify("onStart", note);
        let res = await super.exec($args);
        note.result = res;
        if (!!res && !!res.fail) {
            this.notify("onError", note);
        } else {
            this.notify("onComplete", note);
        }
        return res;
    }
}
