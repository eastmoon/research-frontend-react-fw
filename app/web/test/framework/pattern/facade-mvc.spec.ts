// Test framework Library
import { assert } from "chai";

// Application framework Library
import MVC from "@/framework/pattern/facade/mvc";
import { Container } from "@/framework/pattern/facade/container";
import { IProxy, Service, Proxy } from "@/framework/pattern/proxy";
import { IMediator, Mediator } from "@/framework/pattern/mediator";
import { ICommand, Command, Macro } from "@/framework/pattern/command";

// Declare variable
let m1 : IProxy = new Service();
let m2 : IProxy = new Proxy();
let m3 : IProxy = new Proxy("demo-model");
let v1 : IMediator = new Mediator();
let v2 : IMediator = new Mediator("demo-view");
let c1 : ICommand = new Command();
let c2 : ICommand = new Macro();
let c3 : ICommand = new Macro("demo-controller");
let count = 0;

// Declare function
let f1 = (x : any) => {
    count += (Number(x) + 1);
}
let f2 = (x : any) => {
    count += (Number(x) + 2);
}
let af1 = async (x : any) => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        count += (Number(x) + 1);
        resolve(count);
      } , 1000);
    });
}

// Declare class
class SubService extends Service {
    demo($args : any) {
        return { xstr: $args.str, xval : $args.val };
    }
}

class AsyncService extends Proxy {
    fetchCount(amount : number) {
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(amount + 1), 1000)
      );
    }
    async load($args : any) {
        if ( typeof $args === "number" && $args > 0 ) {
            return await this.fetchCount($args);
        }
        return null;
    }
}
class SubMediator extends Mediator {
    do() {
        count = 100;
        this.notify("click", 5);
    }
}
class CommandC1 extends Command {
    override exec() {
        count += 1;
    }
}
class CommandC2 extends Command {
    override exec() {
        count += 2;
    }
}
class AsyncCommand extends Command {
    async fetchCount(amount : number) {
        return new Promise<number>((resolve) =>
            setTimeout(() => resolve(amount + 1), 1000)
        );
    }
    override async exec($args: any) : Promise<any> {
        if ($args !== undefined && $args !== null) {
            count += await this.fetchCount($args);
        }
        return $args;
    }
}

// Test case
describe('Framework.Pattern.Facade.MVC Tests', () => {
    it('MVC instance retrieve', () => {
        let inst : MVC = MVC.instance;
        assert.instanceOf(inst, MVC);
        assert.ok(typeof inst !== "undefined" && typeof inst === "object");
    });
    it('MVC retrieve Model container', () => {
        assert.instanceOf(MVC.model, Container);
        assert.property(MVC.model, "register");
        assert.typeOf(MVC.model.register, "function");
        assert.property(MVC.model, "remove");
        assert.typeOf(MVC.model.remove, "function");
        assert.property(MVC.model, "retrieve");
        assert.typeOf(MVC.model.retrieve, "function");
        assert.property(MVC.model, "has");
        assert.typeOf(MVC.model.has, "function");
    });
    it('MVC retrieve View container', () => {
        assert.instanceOf(MVC.view, Container);
        assert.property(MVC.view, "register");
        assert.typeOf(MVC.view.register, "function");
        assert.property(MVC.view, "remove");
        assert.typeOf(MVC.view.remove, "function");
        assert.property(MVC.view, "retrieve");
        assert.typeOf(MVC.view.retrieve, "function");
        assert.property(MVC.view, "has");
        assert.typeOf(MVC.view.has, "function");
    });
    it('MVC retrieve Controller container', () => {
        assert.instanceOf(MVC.controller, Container);
        assert.property(MVC.controller, "register");
        assert.typeOf(MVC.controller.register, "function");
        assert.property(MVC.controller, "remove");
        assert.typeOf(MVC.controller.remove, "function");
        assert.property(MVC.controller, "retrieve");
        assert.typeOf(MVC.controller.retrieve, "function");
        assert.property(MVC.controller, "has");
        assert.typeOf(MVC.controller.has, "function");
    });
    it('Model register', () => {
        MVC.register(m1);
        MVC.register(m2);
        MVC.register(m3);
        assert.equal(MVC.model.size, 3);
        assert.ok(MVC.model.has(m1.name));
        assert.ok(MVC.model.has(m2.name));
        assert.ok(MVC.model.has(m3.name));
    });
    it('View register', () => {
        MVC.register(v1);
        MVC.register(v2);
        assert.equal(MVC.view.size, 2);
        assert.ok(MVC.view.has(v1.name));
        assert.ok(MVC.view.has(v2.name));
    });
    it('Controller register', () => {
        MVC.register(c1);
        MVC.register(c2);
        MVC.register(c3);
        assert.equal(MVC.controller.size, 3);
        assert.ok(MVC.controller.has(c1.name));
        assert.ok(MVC.controller.has(c2.name));
        assert.ok(MVC.controller.has(c3.name));
    });
    it('Model remove', () => {
        MVC.remove(m1);
        MVC.remove(m2);
        MVC.remove(m3);
        assert.equal(MVC.model.size, 0);
        assert.notOk(MVC.model.has(m1.name));
        assert.notOk(MVC.model.has(m2.name));
        assert.notOk(MVC.model.has(m3.name));
    });
    it('View remove', () => {
        MVC.remove(v1);
        MVC.remove(v2);
        assert.equal(MVC.view.size, 0);
        assert.notOk(MVC.view.has(v1.name));
        assert.notOk(MVC.view.has(v2.name));
    });
    it('Controller remove', () => {
        MVC.remove(c1);
        MVC.remove(c2);
        MVC.remove(c3);
        assert.equal(MVC.controller.size, 0);
        assert.notOk(MVC.controller.has(c1.name));
        assert.notOk(MVC.controller.has(c2.name));
        assert.notOk(MVC.controller.has(c3.name));
    });
    it('Run model operation', async () => {
        let ms : IProxy = new SubService();
        MVC.register(ms);
        assert.equal(MVC.model.size, 1);
        assert.ok(MVC.model.has(ms.name));
        let res : any = await MVC.op(ms.name, "demo", { str: "123", val: 321 });
        assert.property(res, "xstr");
        assert.equal(res.xstr, "123");
        assert.property(res, "xval");
        assert.equal(res.xval, 321);
        MVC.remove(ms);
        assert.equal(MVC.model.size, 0);
        assert.notOk(MVC.model.has(ms.name));
    });
    it('Run model operation with async/await', async() => {
        let ms : IProxy = new AsyncService();
        MVC.register(ms);
        assert.equal(MVC.model.size, 1);
        assert.ok(MVC.model.has(ms.name));
        let res : any = await MVC.op(ms.name, "load", 5);
        assert.equal(res, 6);
        MVC.remove(ms);
        assert.equal(MVC.model.size, 0);
        assert.notOk(MVC.model.has(ms.name));
    });
    it('Run view event', () => {
        let vs : IMediator = new SubMediator();
        vs.attachEvent("demo1", "click", f1);
        vs.attachEvent("demo2", "click", f2);
        MVC.register(vs);
        assert.equal(MVC.view.size, 1);
        assert.ok(MVC.view.has(vs.name));
        count = 0;
        MVC.on(vs.name, "demo1", "click", 1);
        assert.equal(count, 2);
        MVC.on(vs.name, "demo2", "click", 2);
        assert.equal(count, 6);
        MVC.remove(vs);
        assert.equal(MVC.view.size, 0);
        assert.notOk(MVC.view.has(vs.name));
    });
    it('Run view event with async/await', async () => {
        let vs : IMediator = new SubMediator();
        vs.attachEvent("demo1", "click", af1);
        MVC.register(vs);
        assert.equal(MVC.view.size, 1);
        assert.ok(MVC.view.has(vs.name));
        count = 0;
        await MVC.on(vs.name, "demo1", "click", 1);
        assert.equal(count, 2);
        MVC.remove(vs);
        assert.equal(MVC.view.size, 0);
        assert.notOk(MVC.view.has(vs.name));
    });
    it('Run controller command execute', () => {
        let cs : Macro = new Macro("SubMacro");
        cs.register("1", new CommandC1());
        cs.register("2", new CommandC2());
        MVC.register(cs);
        assert.equal(MVC.controller.size, 1);
        assert.ok(MVC.controller.has(cs.name));
        count = 0;
        MVC.exec(cs.name);
        assert.equal(count, 3);
        MVC.remove(cs);
        assert.equal(MVC.controller.size, 0);
        assert.notOk(MVC.controller.has(cs.name));
    });
    it('Run controller command execute with async/await', async () => {
        let cs : ICommand = new AsyncCommand();
        MVC.register(cs);
        assert.equal(MVC.controller.size, 1);
        assert.ok(MVC.controller.has(cs.name));
        count = 0;
        await MVC.exec(cs.name, 5);
        assert.equal(count, 6);
        MVC.remove(cs);
        assert.equal(MVC.controller.size, 0);
        assert.notOk(MVC.controller.has(cs.name));
    });
    it('Notify with view ', () => {
        let vs : IMediator = new SubMediator();
        vs.attach("move", f1);
        vs.attach("move", f2);
        MVC.register(vs);
        assert.equal(MVC.view.size, 1);
        assert.ok(MVC.view.has(vs.name));
        count = 0;
        MVC.notify(vs.name, "move", 1);
        assert.equal(count, 5);
        MVC.remove(vs);
        assert.equal(MVC.view.size, 0);
        assert.notOk(MVC.view.has(vs.name));
    });
    it('Notify with model ', () => {
        let ps : Proxy = new Proxy("SubProxy");
        ps.attach("calc", f1);
        ps.attach("calc", f2);
        MVC.register(ps);
        assert.equal(MVC.model.size, 1);
        assert.ok(MVC.model.has(ps.name));
        count = 0;
        MVC.notify(ps.name, "calc", 1);
        assert.equal(count, 5);
        MVC.remove(ps);
        assert.equal(MVC.model.size, 0);
        assert.notOk(MVC.model.has(ps.name));
    });
});
