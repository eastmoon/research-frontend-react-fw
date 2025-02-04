// Test framework Library
import { assert } from "chai";

// Application framework Library
import { TPipeBlueprintOptions, TPipeBlueprint, IFilter, IPipe, IPipeController, IProgressNotify, Filter, Pipe, Progress } from "@/framework/pattern/facade/progress";
import { ICommand } from "@/framework/pattern/command";
import { Container } from "@/framework/pattern/facade/container";
import { IPublisher } from "@/framework/pattern/observer";

// Declared variable
let count : number = 0;

// Declare function
function isProps<T>(o : T, prop : string): o is T {
    return !!o && (!!o.hasOwnProperty(prop) || !!o.constructor.prototype[prop]);
}
// Declared class

//// A filter for add token string to ans.
class F1 extends Filter {
    token : string = "";
    constructor($name : string, $token : string) {
        super($name);
        this.token = $token;
    }
    override exec( $args : any ) : any {
        if ( !!$args && typeof $args === "object" ) {
            if (!!!$args["ans"]) { $args["ans"] = "" }
            $args["ans"] += this.token;
        }
        return $args;
    }
}

//// A filter for merge all input object answer, and add token string to ans.
class F2 extends Filter {
    token : string = "";
    constructor($name : string, $token : string) {
        super($name);
        this.token = $token;
    }
    override exec( $args : any ) : any {
        count += 1;
        if ( !!$args && typeof $args === "object" ) {
            let ans : string = "";
            Object.keys($args).forEach((key) => {
                let o : any = $args[key];
                if (!!o && !!o["ans"]) { ans += o["ans"]; }
            })
            $args["ans"] = ans + this.token;
        }
        return $args;
    }
}

//// A filter for check an array length, if not enough size, jump to forward node.
class F3 extends Filter {
    token : string = "";
    constructor($name : string, $token : string) {
        super($name);
        this.token = $token;
    }
    override exec( $args : any ) : any {
        if ( !!$args && typeof $args === "object" ) {
            if (!!!$args["ans"]) { $args["ans"] = "" }
            if ( $args["ans"].length > 10 ) {
                $args["ans"] += this.token;
            } else {
                let pc : IPipeController = {
                    goto: "n1",
                    data: $args
                }
                return pc;
            }
        }
        return $args;
    }
}

//// A filter will throw error message with IPipeController
class F4 extends Filter {
    error ?: any;
    constructor($name : string, $msg ?: any) {
        super($name);
        this.error = $msg;
    }
    override exec() : any {
        let pc : IPipeController
        if (!!this.error) {
            pc = { fail: true, data: this.error };
        } else {
            pc = { fail: true };
        }
        return pc;
    }
}

////
class svc {
    async fetchCount(amount : number) {
        return new Promise<number>((resolve) =>
            setTimeout(() => resolve(amount + 1), 1000)
        );
    }
}

class SFilter extends Filter {
    override exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.sval += 5;
        }
        return $args;
    }
}

class AFilter extends Filter {
    override async exec($args: any) : Promise<any> {
        if ($args !== undefined && $args !== null) {
            let s : svc = new svc();
            $args.aval += await s.fetchCount(5);
        }
        return $args;
    }
}

// Test case
describe('Framework.Pattern.Facade.Progress Tests', () => {
    it('Filter has ICommand interface ', () => {
        let o : ICommand = new Filter();
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
        assert.property(o, "exec");
        assert.typeOf(o.exec, "function");
    });
    it('Pipe has ICommand interface', () => {
        let o : ICommand = new Pipe();
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
        assert.property(o, "exec");
        assert.typeOf(o.exec, "function");
    });
    it('Pipe has Container method', () => {
        let o : Pipe = new Pipe();
        assert.instanceOf(o, Container);
        assert.property(o, "register");
        assert.typeOf(o.register, "function");
        assert.property(o, "remove");
        assert.typeOf(o.remove, "function");
        assert.property(o, "retrieve");
        assert.typeOf(o.retrieve, "function");
        assert.property(o, "has");
        assert.typeOf(o.has, "function");
        assert.property(o, "size");
        assert.typeOf(o.size, "number");
        assert.property(o, "keys");
        assert.typeOf(o.keys, "array");
    });
    it('Pipe has IPipe interface', () => {
        let o : IPipe = new Pipe();
        assert.property(o, "blueprint");
        assert.typeOf(o.blueprint, "function");
        assert.property(o, "exec");
        assert.typeOf(o.exec, "function");
    });
    it('Progress has Pipe method', () => {
        let o : Progress = new Progress();
        assert.instanceOf(o, Pipe);
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
        assert.property(o, "exec");
        assert.typeOf(o.exec, "function");
        assert.property(o, "register");
        assert.typeOf(o.register, "function");
        assert.property(o, "remove");
        assert.typeOf(o.remove, "function");
        assert.property(o, "retrieve");
        assert.typeOf(o.retrieve, "function");
        assert.property(o, "has");
        assert.typeOf(o.has, "function");
        assert.property(o, "size");
        assert.typeOf(o.size, "number");
        assert.property(o, "keys");
        assert.typeOf(o.keys, "array");
        assert.property(o, "blueprint");
        assert.typeOf(o.blueprint, "function");
        assert.property(o, "exec");
        assert.typeOf(o.exec, "function");
    });
    it('Progress has IPublisher interface', () => {
        let o : IPublisher = new Progress();
        assert.property(o, "attach");
        assert.typeOf(o.attach, "function");
        assert.property(o, "detach");
        assert.typeOf(o.detach, "function");
        assert.property(o, "subscribe");
        assert.typeOf(o.subscribe, "function");
        assert.property(o, "unsubscribe");
        assert.typeOf(o.unsubscribe, "function");
        assert.property(o, "notify");
        assert.typeOf(o.notify, "function");
    });
    it('IPipeController interface for pipe controller and error response', () => {
        let o : IPipeController = {
            goto: "node1",
            fail: false,
            data: {val: 123}
        }
        assert.ok(isProps<IPipeController>(o, "goto"));
        assert.ok(isProps<IPipeController>(o, "fail"));
        assert.ok(isProps<IPipeController>(o, "data"));
        assert.notOk(isProps<IPipeController>(o, "unknowProperty"));
    });
    it('IProgressNotify interface for progress event notification', () => {
        let o : IProgressNotify = {
            progress : new Progress(),
            args : {val: 123},
            result : {val: 123}
        }
        assert.ok(isProps<IProgressNotify>(o, "progress"));
        assert.ok(isProps<IProgressNotify>(o, "args"));
        assert.ok(isProps<IProgressNotify>(o, "result"));
        assert.notOk(isProps<IProgressNotify>(o, "unknowProperty"));
    });
    it('Pipe and Filter basic operate like Macro Command. Run with name sequence.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let p : IPipe = new Pipe();
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "12");
    });
    it('Pipe can run nest structure.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let p1 : IPipe = new Pipe();
        let p2 : IPipe = new Pipe();
        let p : IPipe = new Pipe();
        p1.register("1", f1);
        p1.register("2", f2);
        p2.register("1", f2);
        p2.register("2", f1);
        p.register("1", p1);
        p.register("2", p2);
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "1221");
    });
    it('Pipe alway run with async / await.', async () => {
        let f1 : IFilter = new SFilter();
        let f2 : IFilter = new AFilter();
        let p : Pipe = new Pipe();
        p.register("1", f1);
        p.register("2", f2);
        let res : any = await p.exec({sval: 0, aval: 0});
        assert.property(res, "sval");
        assert.typeOf(res.sval, "number");
        assert.equal(res.sval, 5);
        assert.property(res, "aval");
        assert.typeOf(res.aval, "number");
        assert.equal(res.aval, 6);
    }).timeout(1010);
    it('Pipe blueprint object must have a key name "in". If not have key, pipe will run with name sequence.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let p : IPipe = new Pipe();
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        p.blueprint({});
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "12");
    });
    it('Pipe blueprint object must have "in" key and "out" value, when pipe run will follow the configuration.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let p : IPipe = new Pipe();
        let bp : TPipeBlueprint = {
          "in" : "n2",
          "n1" : "out",
          "n2" : "n1"
        }
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        p.blueprint(bp);
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "21");
    });
    it('Pipe blueprint, each node output can point at least 1 node.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let f3 : IFilter = new F2("n3", "3");
        let p : IPipe = new Pipe();
        let bp : TPipeBlueprint = {
          "in" : [ "n1", "n2" ],
          "n1" : "n3",
          "n2" : "n3",
          "n3" : "out"
        }
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        p.register(f3.name, f3);
        p.blueprint(bp);
        count = 0;
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "123");
        assert.equal(count, 2);
    });
    it('Pipe blueprint, each node input use "or" flag. If want all input arrive then run, use "and" flag.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let f3 : IFilter = new F2("n3", "3");
        let p : IPipe = new Pipe();
        let bp : TPipeBlueprint = {
          "in" : [ "n1", "n2" ],
          "n1" : "n3",
          "n2" : "n3",
          "n3" : "out"
        }
        let bpo : TPipeBlueprintOptions = {
          "n3" : "and"
        }
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        p.register(f3.name, f3);
        p.blueprint(bp, bpo);
        count = 0;
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "123");
        assert.equal(count, 1);
    });
    it('Pipe can use IPipeController to jump in each node.', async () => {
        let f1 : IFilter = new F1("n1", "1");
        let f2 : IFilter = new F1("n2", "2");
        let f3 : IFilter = new F3("n3", "3");
        let p : IPipe = new Pipe();
        p.register(f1.name, f1);
        p.register(f2.name, f2);
        p.register(f3.name, f3);
        let res : any = await p.exec({ans:""});
        assert.property(res, "ans");
        assert.typeOf(res.ans, "string");
        assert.equal(res.ans, "1212121212123");
    });
    it('Pipe can throw error with IPipeController.', async () => {
        let f : IFilter = new F4("n1");
        let p : IPipe = new Pipe();
        p.register(f.name, f);
        let res : any = await p.exec({ans:""});
        assert.ok(isProps<IPipeController>(res, "fail"));
        assert.ok(isProps<IPipeController>(res, "data"));
        assert.typeOf(res.data, "string");
        assert.include(res.data, "n1");
        assert.include(res.data, "failed");
    });
    it('Pipe can throw error and error message with IPipeController.', async () => {
        let f : IFilter = new F4("n1", "error message");
        let p : IPipe = new Pipe();
        p.register(f.name, f);
        let res : any = await p.exec({ans:""});
        assert.ok(isProps<IPipeController>(res, "fail"));
        assert.ok(isProps<IPipeController>(res, "data"));
        assert.typeOf(res.data, "string");
        assert.include(res.data, "error message");
    });
    it('Pipe can throw error message with object, but object will translate to JSON format.', async () => {
        let f : IFilter = new F4("n1", {msg: "error message", data : [ 1, 2, 3, 4, 5, 6]});
        let p : IPipe = new Pipe();
        p.register(f.name, f);
        let res : any = await p.exec({ans:""});
        assert.ok(isProps<IPipeController>(res, "fail"));
        assert.ok(isProps<IPipeController>(res, "data"));
        assert.typeOf(res.data, "string");
        assert.include(res.data, "error message");
        assert.include(res.data, "[1,2,3,4,5,6]");
    });
    it('Progress is base with Pipe, but addition Publisher functional. And execute progress will notify "onStart", "onComplete" event. ', async () => {
        function onStart($note : any) {
            assert.ok(isProps<IProgressNotify>($note, "progress"));
            assert.ok(isProps<IProgressNotify>($note, "args"));
            assert.instanceOf($note.progress, Progress);
            assert.property($note.args, "sval");
            assert.typeOf($note.args.sval, "number");
            assert.equal($note.args.sval, 0);
            assert.property($note.args, "aval");
            assert.typeOf($note.args.aval, "number");
            assert.equal($note.args.aval, 0);
        }
        function onComplete($note : any) {
            assert.ok(isProps<IProgressNotify>($note, "progress"));
            assert.ok(isProps<IProgressNotify>($note, "args"));
            assert.ok(isProps<IProgressNotify>($note, "result"));
            assert.instanceOf($note.progress, Progress);
            assert.property($note.args, "sval");
            assert.typeOf($note.args.sval, "number");
            assert.equal($note.args.sval, 0);
            assert.property($note.args, "aval");
            assert.typeOf($note.args.aval, "number");
            assert.equal($note.args.aval, 0);
            assert.property($note.result, "sval");
            assert.typeOf($note.result.sval, "number");
            assert.equal($note.result.sval, 5);
            assert.property($note.result, "aval");
            assert.typeOf($note.result.aval, "number");
            assert.equal($note.result.aval, 6);
        }
        let f1 : IFilter = new SFilter();
        let f2 : IFilter = new AFilter();
        let p : Progress = new Progress();
        p.register("1", f1);
        p.register("2", f2);
        p.attach("onStart", onStart);
        p.attach("onComplete", onComplete);
        await p.exec({sval: 0, aval: 0});
    }).timeout(1010);

    it('Progress when any node response fail, will notify "onError" event.', async () => {
        function onStart($note : any) {
            assert.ok(isProps<IProgressNotify>($note, "progress"));
            assert.ok(isProps<IProgressNotify>($note, "args"));
            assert.instanceOf($note.progress, Progress);
            assert.property($note.args, "sval");
            assert.typeOf($note.args.sval, "number");
            assert.equal($note.args.sval, 0);
            assert.property($note.args, "aval");
            assert.typeOf($note.args.aval, "number");
            assert.equal($note.args.aval, 0);
        }
        function onError($note : any) {
            assert.ok(isProps<IProgressNotify>($note, "progress"));
            assert.ok(isProps<IProgressNotify>($note, "args"));
            assert.ok(isProps<IProgressNotify>($note, "result"));
            assert.instanceOf($note.progress, Progress);
            assert.property($note.args, "sval");
            assert.typeOf($note.args.sval, "number");
            assert.equal($note.args.sval, 0);
            assert.property($note.args, "aval");
            assert.typeOf($note.args.aval, "number");
            assert.equal($note.args.aval, 0);
            assert.ok(isProps<IPipeController>($note.result, "fail"));
            assert.ok(isProps<IPipeController>($note.result, "data"));
            assert.typeOf($note.result.data, "string");
            assert.include($note.result.data, "error message");
        }
        let f1 : IFilter = new F4("n1", "error message");
        let f2 : IFilter = new SFilter();
        let p : Progress = new Progress();
        p.register("1", f1);
        p.register("2", f2);
        p.attach("onStart", onStart);
        p.attach("onError", onError);
        await p.exec({sval: 0, aval: 0});
    }).timeout(1010);
});
