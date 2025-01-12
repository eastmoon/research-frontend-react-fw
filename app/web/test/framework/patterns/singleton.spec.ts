// Test framework Library
import { assert } from "chai";

// Application framework Library
import Singleton from "@/framework/pattern/singleton";

// Declared class or variable
class ChildrenSingleton extends Singleton {
    val : number;
    constructor() {
        super();
        this.val = 123;
    }
}

// Test case
describe('Framework.Pattern.Singleton Tests', () => {
    it('Singleton instance retrieve', () => {
        let inst : Singleton = Singleton.instance;
        assert.ok(inst instanceof Singleton);
        assert.ok(typeof inst !== "undefined" && typeof inst === "object");
    });
    it('Singleton instance is only one.', () => {
        let inst1 : Singleton = Singleton.instance;
        let inst2 : Singleton = Singleton.instance;
        let nobj1 : Singleton = new Singleton();
        let nobj2 : Singleton = new Singleton();
        assert.equal(inst1, inst2);
        assert.equal(inst1, nobj1);
        assert.equal(inst1, nobj2);
        assert.equal(inst2, nobj1);
        assert.equal(inst2, nobj2 );
        assert.equal(nobj1, nobj2);
    });
    it('Inherit singleton class.', () => {
        assert.notEqual(Singleton, ChildrenSingleton);
        assert.ok(Singleton.instance instanceof Singleton);
        assert.ok(ChildrenSingleton.instance instanceof Singleton);
        assert.ok(ChildrenSingleton.instance instanceof ChildrenSingleton);
    });
    it('Inherit singleton class have self property..', () => {
        let inst = ChildrenSingleton.instance;
        assert.equal(inst.val, 123);
    });
});
