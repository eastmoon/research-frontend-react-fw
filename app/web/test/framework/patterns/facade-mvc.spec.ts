// Test framework Library
import { assert } from "chai";

// Application framework Library
import Application from "@/framework/pattern/facade/mvc";
import { Container } from "@/framework/pattern/facade/container";
import { IProxy, Service, Proxy } from "@/framework/pattern/proxy";
import { IMediator, Mediator } from "@/framework/pattern/mediator";
import { ICommand, Simple, Macro } from "@/framework/pattern/command";

// Declare variable
let m1 : IProxy = new Service();
let m2 : IProxy = new Proxy();
let m3 : IProxy = new Proxy("demo-model");
let v1 : IMediator = new Mediator();
let v2 : IMediator = new Mediator("demo-view");
let c1 : ICommand = new Simple();
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

// Declare class
class SubService extends Service {
    demo($args : any) {
        return { xstr: $args.str, xval : $args.val };
    }
}
class SubMediator extends Mediator {
    do() {
        count = 100;
        this.notify("click", 5);
    }
}
class SimpleC1 extends Simple {
    exec() {
        count += 1;
    }
}
class SimpleC2 extends Simple {
    exec() {
        count += 2;
    }
}

// Test case
describe('Framework.Pattern.Facade.mvc Tests', () => {
    it('Application instance retrieve', () => {
        let inst : Application = Application.instance;
        assert.instanceOf(inst, Application);
        assert.ok(typeof inst !== "undefined" && typeof inst === "object");
    });
    it('Application retrieve Model container', () => {
        assert.instanceOf(Application.model, Container);
        assert.property(Application.model, "register");
        assert.typeOf(Application.model.register, "function");
        assert.property(Application.model, "remove");
        assert.typeOf(Application.model.remove, "function");
        assert.property(Application.model, "retrieve");
        assert.typeOf(Application.model.retrieve, "function");
        assert.property(Application.model, "has");
        assert.typeOf(Application.model.has, "function");
    });
    it('Application retrieve View container', () => {
        assert.instanceOf(Application.view, Container);
        assert.property(Application.view, "register");
        assert.typeOf(Application.view.register, "function");
        assert.property(Application.view, "remove");
        assert.typeOf(Application.view.remove, "function");
        assert.property(Application.view, "retrieve");
        assert.typeOf(Application.view.retrieve, "function");
        assert.property(Application.view, "has");
        assert.typeOf(Application.view.has, "function");
    });
    it('Application retrieve Controller container', () => {
        assert.instanceOf(Application.controller, Container);
        assert.property(Application.controller, "register");
        assert.typeOf(Application.controller.register, "function");
        assert.property(Application.controller, "remove");
        assert.typeOf(Application.controller.remove, "function");
        assert.property(Application.controller, "retrieve");
        assert.typeOf(Application.controller.retrieve, "function");
        assert.property(Application.controller, "has");
        assert.typeOf(Application.controller.has, "function");
    });
    it('Model register', () => {
        Application.register(m1);
        Application.register(m2);
        Application.register(m3);
        assert.equal(Application.model.size, 3);
        assert.ok(Application.model.has(m1.name));
        assert.ok(Application.model.has(m2.name));
        assert.ok(Application.model.has(m3.name));
    });
    it('View register', () => {
        Application.register(v1);
        Application.register(v2);
        assert.equal(Application.view.size, 2);
        assert.ok(Application.view.has(v1.name));
        assert.ok(Application.view.has(v2.name));
    });
    it('Controller register', () => {
        Application.register(c1);
        Application.register(c2);
        Application.register(c3);
        assert.equal(Application.controller.size, 3);
        assert.ok(Application.controller.has(c1.name));
        assert.ok(Application.controller.has(c2.name));
        assert.ok(Application.controller.has(c3.name));
    });
    it('Model remove', () => {
        Application.remove(m1);
        Application.remove(m2);
        Application.remove(m3);
        assert.equal(Application.model.size, 0);
        assert.notOk(Application.model.has(m1.name));
        assert.notOk(Application.model.has(m2.name));
        assert.notOk(Application.model.has(m3.name));
    });
    it('View remove', () => {
        Application.remove(v1);
        Application.remove(v2);
        assert.equal(Application.view.size, 0);
        assert.notOk(Application.view.has(v1.name));
        assert.notOk(Application.view.has(v2.name));
    });
    it('Controller remove', () => {
        Application.remove(c1);
        Application.remove(c2);
        Application.remove(c3);
        assert.equal(Application.controller.size, 0);
        assert.notOk(Application.controller.has(c1.name));
        assert.notOk(Application.controller.has(c2.name));
        assert.notOk(Application.controller.has(c3.name));
    });
    it('Run model operation', () => {
        let ms : IProxy = new SubService();
        Application.register(ms);
        assert.equal(Application.model.size, 1);
        assert.ok(Application.model.has(ms.name));
        let res : any = Application.op(ms.name, "demo", { str: "123", val: 321 });
        assert.property(res, "xstr");
        assert.equal(res.xstr, "123");
        assert.property(res, "xval");
        assert.equal(res.xval, 321);
        Application.remove(ms);
        assert.equal(Application.model.size, 0);
        assert.notOk(Application.model.has(ms.name));
    });
    it('Run view event', () => {
        let vs : IMediator = new SubMediator();
        vs.attachEvent("demo1", "click", f1);
        vs.attachEvent("demo2", "click", f2);
        Application.register(vs);
        assert.equal(Application.view.size, 1);
        assert.ok(Application.view.has(vs.name));
        count = 0;
        Application.on(vs.name, "demo1", "click", 1);
        assert.equal(count, 2);
        Application.on(vs.name, "demo2", "click", 2);
        assert.equal(count, 6);
        Application.remove(vs);
        assert.equal(Application.view.size, 0);
        assert.notOk(Application.view.has(vs.name));
    });
    it('Run controller command execute', () => {
        let cs : Macro = new Macro("SubMacro");
        cs.register("1", new SimpleC1());
        cs.register("2", new SimpleC2());
        Application.register(cs);
        assert.equal(Application.controller.size, 1);
        assert.ok(Application.controller.has(cs.name));
        count = 0;
        Application.exec(cs.name);
        assert.equal(count, 3);
        Application.remove(cs);
        assert.equal(Application.controller.size, 0);
        assert.notOk(Application.controller.has(cs.name));
    });
    it('Notify with view ', () => {
        let vs : IMediator = new SubMediator();
        vs.attach("move", f1);
        vs.attach("move", f2);
        Application.register(vs);
        assert.equal(Application.view.size, 1);
        assert.ok(Application.view.has(vs.name));
        count = 0;
        Application.notify(vs.name, "move", 1);
        assert.equal(count, 5);
        Application.remove(vs);
        assert.equal(Application.view.size, 0);
        assert.notOk(Application.view.has(vs.name));
    });
    it('Notify with model ', () => {
        let ps : Proxy = new Proxy("SubProxy");
        ps.attach("calc", f1);
        ps.attach("calc", f2);
        Application.register(ps);
        assert.equal(Application.model.size, 1);
        assert.ok(Application.model.has(ps.name));
        count = 0;
        Application.notify(ps.name, "calc", 1);
        assert.equal(count, 5);
        Application.remove(ps);
        assert.equal(Application.model.size, 0);
        assert.notOk(Application.model.has(ps.name));
    });
});
