// Test framework Library
import { assert } from "chai";

// Application framework Library
import { IMediator, Mediator } from "@/framework/pattern/mediator";
import { Publisher } from "@/framework/pattern/observer";
import { Container } from "@/framework/pattern/facade/container";

// Declare class
var count = 0
let f1 = (x : any) => {
    count += (Number(x) + 1);
}
let f2 = (x : any) => {
    count += (Number(x) + 2);
}
let f3 = () => {
    count += 1;
}
let f4 = () => {
    count += 2;
}
let af1 = async (x : any) => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        count += (Number(x) + 1);
        resolve(count);
      } , 1000);
    });
}
class SubMediator extends Mediator {
    do() {
        count = 100;
        this.notify("click", 5);
    }
}

// Test case
describe('Framework.Pattern.Mediator Tests', () => {
    it('Mediator interface', () => {
        let o : IMediator = new Mediator();
        assert.property(o, "attachEvent");
        assert.typeOf(o.attachEvent, "function");
        assert.property(o, "detachEvent");
        assert.typeOf(o.detachEvent, "function");
        assert.property(o, "on");
        assert.typeOf(o.on, "function");
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
    });
    it('Mediator has Container method', () => {
        let o : Mediator = new Mediator();
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
    });
    it('Mediator has Publisher method', () => {
        let o : IMediator = new Mediator();
        assert.instanceOf(o, Publisher);
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
    it('Mediator attach event with component name', () => {
        let o : Mediator = new Mediator();
        o.attachEvent("demo1", "click", f1);
        o.attachEvent("demo1", "move", f3);
        assert.equal(o.count, 1);
        assert.equal(o.size, 2);
    });
    it('Mediator detach event with component name', () => {
        let o : Mediator = new Mediator();
        count = 0;
        o.attachEvent("demo1", "click", f1);
        o.attachEvent("demo2", "click", f2);
        assert.equal(o.count, 2);
        assert.equal(o.size, 1);
        o.detachEvent("demo1", "click");
        assert.equal(o.count, 1);
        o.detachEvent("demo2", "click");
        assert.equal(o.count, 0);
        assert.equal(o.size, 0);
    });
    it('Mediator detach by component name', () => {
        let o : Mediator = new Mediator();
        count = 0;
        o.attachEvent("demo1", "click", f1);
        o.attachEvent("demo2", "click", f2);
        o.attachEvent("demo1", "move", f3);
        o.attachEvent("demo2", "move", f4);
        assert.equal(o.count, 2);
        assert.equal(o.size, 2);
        o.detachEvent("demo1");
        assert.equal(o.count, 1);
        assert.equal(o.size, 2);
        o.detachEvent("demo2");
        assert.equal(o.count, 0);
        assert.equal(o.size, 0);
    });
    it('Mediator notify with event name', () => {
        let o : IMediator = new Mediator();
        count = 0;
        o.attachEvent("demo1", "click", f1);
        o.attach("click", f2);
        o.notify("click", 1);
        assert.equal(count, 5);
    });
    it('Mediator can execute event on component', () => {
        let o : IMediator = new Mediator();
        count = 0;
        o.attachEvent("demo1", "click", f1);
        o.on("demo", "click", 1);
        assert.equal(count, 0);
        o.on("demo1", "click1", 1);
        assert.equal(count, 0);
        o.on("demo1", "click", 1);
        assert.equal(count, 2);
    });
    it('Mediator can execute event on component with async/await', async () => {
        let o : IMediator = new Mediator();
        count = 0;
        o.attachEvent("demo1", "click", af1);
        await o.on("demo1", "click", 5);
        assert.equal(count, 6);
    });
    it('Inherit Mediator and use method to notify evnet', () => {
        let o : SubMediator = new SubMediator();
        count = 0;
        o.attachEvent("demo1", "click", f1);
        o.attachEvent("demo2", "click", f2);
        o.do();
        assert.equal(count, 113)
    });
});
