// Test framework Library
import { assert } from "chai";

// Application framework Library
import { ISubscriber, ISubject, Subject, IPublisher, Publisher } from "@/framework/pattern/observer";
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
let sub : ISubscriber = {
    subject: "demo",
    handler: (x) => { count += (Number(x) + 3) }
}

// Test case
describe('Framework.Pattern.Observer Tests', () => {
    it('Subject interface', () => {
        let o : ISubject = new Subject();
        assert.property(o, "attach");
        assert.typeOf(o.attach, "function");
        assert.property(o, "detach");
        assert.typeOf(o.detach, "function");
        assert.property(o, "notify");
        assert.typeOf(o.notify, "function");
        assert.property(o, "size");
        assert.typeOf(o.size, "number");
    });
    it('Subject attach handler', () => {
        let o : ISubject = new Subject();
        o.attach(f1);
        o.attach(f2);
        assert.equal(o.size, 2);
        o.attach(f1);
        o.attach(f2);
        assert.equal(o.size, 2);
    });
    it('Subject detach handler', () => {
        let o : ISubject = new Subject();
        o.attach(f1);
        o.attach(f2);
        assert.equal(o.size, 2);
        o.detach(f2);
        assert.equal(o.size, 1);
        o.detach(f2);
        assert.equal(o.size, 1);
        o.detach(f1);
        assert.equal(o.size, 0);
    });
    it('Subject notify to handler', () => {
        let o : ISubject = new Subject();
        count = 0;
        o.attach(f1);
        o.attach(f2);
        o.notify(1);
        assert.equal(count, 5);
        count = 0;
        o.detach(f2);
        o.notify(1);
        assert.equal(count, 2);
        count = 0;
        o.detach(f1);
        o.notify(1);
        assert.equal(count, 0);
    });
    it('Subject notify can empty arguments', () => {
        let o : ISubject = new Subject();
        count = 0;
        o.attach(f3);
        o.attach(f4);
        o.notify();
        assert.equal(count, 3);
        count = 0;
        o.detach(f3);
        o.notify();
        assert.equal(count, 2);
    });
    it('Publisher interface', () => {
        let o : IPublisher = new Publisher();
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
    it('Publisher has container method', () => {
        let o : Publisher = new Publisher();
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
    it('Publisher attach handler with subject name', () => {
        let o : Publisher = new Publisher();
        o.attach("demo", f1);
        assert.equal(o.size, 1);
    });
    it('Publisher detach handler with subject name', () => {
        let o : Publisher = new Publisher();
        o.attach("demo", f1);
        assert.equal(o.size, 1);
        o.detach("demo", f1);
        assert.equal(o.size, 0);
    });
    it('Publisher subscribe with ISubscriber', () => {
        let o : Publisher = new Publisher();
        o.subscribe({
            subject: "demo",
            handler: f2
        })
        o.subscribe(sub);
        let s : ISubject | null = o.retrieve("demo");
        assert.isNotNull(s);
        if ( s !== null ) {
            assert.equal(s.size, 2);
            assert.equal(o.size, 1);
        }
    });
    it('Publisher unsubscribe with ISubscriber', () => {
        let o : Publisher = new Publisher();
        o.subscribe({
            subject: "demo",
            handler: f2
        })
        o.subscribe(sub);
        let s : ISubject | null = o.retrieve("demo");
        assert.isNotNull(s);
        if ( s !== null ) {
            assert.equal(s.size, 2);
            assert.equal(o.size, 1);
            o.unsubscribe(sub);
            assert.equal(s.size, 1);
            o.detach("demo", f2);
            assert.equal(s.size, 0);
            assert.equal(o.size, 0);
        }
    });
    it('Publisher notify to handler', () => {
        let o : IPublisher = new Publisher();
        count = 0;
        o.attach("demo", f1);
        o.subscribe(sub);
        o.notify("demo", 1);
        assert.equal(count, 6);
        count = 0;
        o.attach("demo2", f2);
        o.notify("demo2", 1);
        assert.equal(count, 3);
        count = 0;
        o.unsubscribe(sub);
        o.notify("demo", 1);
        assert.equal(count, 2);
    });
    it('Publisher notify can empty arguments', () => {
        let o : IPublisher = new Publisher();
        count = 0;
        o.attach("demo", f3);
        o.attach("demo", f4);
        o.notify("demo");
        assert.equal(count, 3);
        count = 0;
        o.detach("demo", f3);
        o.notify("demo");
        assert.equal(count, 2);
    });
});
