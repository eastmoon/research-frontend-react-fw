// Test framework Library
import { assert } from "chai";

// Application framework Library
import { IContainer, Container } from "@/framework/pattern/facade/container";

// Declared class or variable
class Demo {
    name : string = "";
    constructor($name : string) {
        this.name = $name
    }
}

// Test case
describe('Framework.Pattern.Facade.Container Tests', () => {
    it('Container interface', () => {
        let c : IContainer<any> = new Container();
        assert.property(c, "register");
        assert.typeOf(c.register, "function");
        assert.property(c, "remove");
        assert.typeOf(c.remove, "function");
        assert.property(c, "retrieve");
        assert.typeOf(c.retrieve, "function");
        assert.property(c, "has");
        assert.typeOf(c.has, "function");
    });
    it('Container register content', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        let d2 = new Demo("2");
        assert.ok(c.register(d1.name, d1));
        assert.ok(c.register(d2.name, d2));
        assert.notOk(c.register(d1.name, d1));
        assert.notOk(c.register(d2.name, d2));
    });
    it('Container remove content', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        assert.ok(c.register(d1.name, d1));
        assert.ok(c.remove(d1.name));
        assert.notOk(c.remove(d1.name));
        assert.notOk(c.remove("NULL"));
    });
    it('Container retrieve content', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        assert.ok(c.register(d1.name, d1));
        assert.equal(c.retrieve(d1.name), d1);
        assert.isNull(c.retrieve("NULL"));
    });
    it('Container has content', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        assert.ok(c.register(d1.name, d1));
        assert.ok(c.has(d1.name));
        assert.notOk(c.has("NULL"));
    });
    it('Container size', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        let d2 = new Demo("2");
        assert.ok(c.register(d1.name, d1));
        assert.ok(c.register(d2.name, d2));
        assert.equal(c.size, 2);
        assert.ok(c.remove(d1.name));
        assert.equal(c.size, 1);
        assert.ok(c.remove(d2.name));
        assert.equal(c.size, 0);
    });;
    it('Container keys', () => {
        let c : IContainer<Demo> = new Container<Demo>();
        let d1 = new Demo("1");
        let d2 = new Demo("2");
        assert.ok(c.register(d1.name, d1));
        assert.ok(c.register(d2.name, d2));
        assert.include(c.keys, "1");
        assert.include(c.keys, "2");
        assert.notInclude(c.keys, "3");
    });
});
