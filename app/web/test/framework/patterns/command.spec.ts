// Test framework Library
import { assert } from "chai";

// Application framework Library
import { ICommand, Macro, Simple } from "@/framework/pattern/command";
import { IContainer } from "@/framework/pattern/facade/container";

// Declared class or variable
var count = 0;
interface Args {
    val : number;
    str : string;
}

class c1 extends Simple {
    exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.val = 123;
        }
        return $args;
    }
}

class c2 extends Simple {
    exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.str = "c2";
        }
        return $args;
    }
}

class c3 extends Simple {
    exec() {
        count += 1;
    }
}

class c4 extends Simple {
    exec() {
        count += 2;
    }
}


// Test case
describe('DEV Framework.Pattern.Command Tests', () => {
    it('Simple Command interface', () => {
        let c : ICommand = new Simple();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.property(c, "exec");
        assert.typeOf(c.exec, "function");
    });
    it('Simple command property name', () => {
        let c : ICommand = new Simple();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.equal(c.name, "Simple");
        c = new Simple("demo-simple-command");
        assert.equal(c.name, "demo-simple-command");
    });
    it('Simple command method execute with object parameter', () => {
        let c : ICommand = new Simple();
        let a : Args = { val : 1, str : "demo" };
        let r : Args = c.exec(a);
        assert.property(r, "val");
        assert.typeOf(r.val, "number");
        assert.equal(r.val, 1);
        assert.property(r, "str");
        assert.typeOf(r.str, "string");
        assert.equal(r.str, "demo");
    });
    it('Inherit Simple command and execute', () => {
        class cc extends Simple {
            exec($args: any) : any {
                if ($args !== undefined && $args !== null) {
                    $args.val += 1;
                }
                return $args;
            }
        }
        let c : ICommand = new cc();
        let a : Args = { val : 1, str : "demo" };
        c.exec(a);
        assert.property(a, "val");
        assert.typeOf(a.val, "number");
        assert.equal(a.val, 2);
        c.exec(a);
        assert.property(a, "val");
        assert.typeOf(a.val, "number");
        assert.equal(a.val, 3);
        c.exec();
    });
    it('Macro command interface', () => {
        let c : ICommand = new Macro();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.property(c, "exec");
        assert.typeOf(c.exec, "function");
    });
    it('Macro command have Container interface', () => {
        let c : IContainer = new Macro();
        assert.property(c, "register");
        assert.typeOf(c.register, "function");
        assert.property(c, "remove");
        assert.typeOf(c.remove, "function");
        assert.property(c, "retrieve");
        assert.typeOf(c.retrieve, "function");
        assert.property(c, "has");
        assert.typeOf(c.has, "function");
    });
    it('Macro command property name', () => {
        let c : ICommand = new Macro();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.equal(c.name, "Macro");
        c = new Macro("demo-macro-command");
        assert.equal(c.name, "demo-macro-command");
    });
    it('Macro command method execute with object parameter', () => {
        assert.ok( 1 === 1);
        let m : Macro = new Macro(null);
        let a : Args = { val : 1, str : "demo" };
        m.register("1", new c1());
        m.register("2", new c2());
        assert.equal(m.size, 2);
        assert.equal(a.val, 1);
        assert.equal(a.str, "demo");
        m.exec(a);
        assert.equal(a.val, 123);
        assert.equal(a.str, "c2");
        a = { val : 1, str : "demo" };
        m.exec();
        assert.equal(a.val, 1);
        assert.equal(a.str, "demo");
    });
    it('Macro command method execute without parameter', () => {
        let m : Macro = new Macro();
        m.register("1", new c3());
        m.register("2", new c4());
        m.exec();
        assert.equal(m.size, 2);
        assert.equal(count, 3);
        m.remove("2");
        m.exec();
        assert.equal(count, 4);
    });
});
