// Test framework Library
import { assert } from "chai";

// Application framework Library
import { ICommand, Command, Macro, AsyncMacro } from "@/framework/pattern/command";
import { IContainer } from "@/framework/pattern/facade/container";

// Declared class or variable
var count = 0;
interface Args {
    val : number;
    str : string;
}

class c1 extends Command {
    override exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.val = 123;
        }
        return $args;
    }
}

class c2 extends Command {
    override exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.str = "c2";
        }
        return $args;
    }
}

class c3 extends Command {
    override exec() {
        count += 1;
    }
}

class c4 extends Command {
    override exec() {
        count += 2;
    }
}

class svc {
    async fetchCount(amount : number) {
        return new Promise<number>((resolve) =>
            setTimeout(() => resolve(amount + 1), 1000)
        );
    }
}

class ac1 extends Command {
    override async exec($args: any) : Promise<any> {
        if ($args !== undefined && $args !== null) {
            let s : svc = new svc();
            $args.val += await s.fetchCount(5);
        }
        return $args;
    }
}


// Test case
describe('Framework.Pattern.Command Tests', () => {
    it('Command interface', () => {
        let c : ICommand = new Command();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.property(c, "exec");
        assert.typeOf(c.exec, "function");
    });
    it('Command property name', () => {
        let c : ICommand = new Command();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.equal(c.name, "Command");
        c = new Command("demo-simple-command");
        assert.equal(c.name, "demo-simple-command");
    });
    it('Command method execute with object parameter', () => {
        let c : ICommand = new Command();
        let a : Args = { val : 1, str : "demo" };
        let r : Args = c.exec(a);
        assert.property(r, "val");
        assert.typeOf(r.val, "number");
        assert.equal(r.val, 1);
        assert.property(r, "str");
        assert.typeOf(r.str, "string");
        assert.equal(r.str, "demo");
    });
    it('Inherit Command and execute', () => {
        class cc extends Command {
            override exec($args: any) : any {
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
    it('Macro interface', () => {
        let c : ICommand = new Macro();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.property(c, "exec");
        assert.typeOf(c.exec, "function");
    });
    it('Macro have Container interface', () => {
        let c : IContainer<ICommand> = new Macro();
        assert.property(c, "register");
        assert.typeOf(c.register, "function");
        assert.property(c, "remove");
        assert.typeOf(c.remove, "function");
        assert.property(c, "retrieve");
        assert.typeOf(c.retrieve, "function");
        assert.property(c, "has");
        assert.typeOf(c.has, "function");
    });
    it('Macro property name', () => {
        let c : ICommand = new Macro();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.equal(c.name, "Macro");
        c = new Macro("demo-macro-command");
        assert.equal(c.name, "demo-macro-command");
    });
    it('Macro method execute with object parameter', () => {
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
    it('Macro method execute without parameter', () => {
        count = 0;
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
    it('AsyncMacro method execute with sync command', async () => {
        count = 0;
        let m : AsyncMacro = new AsyncMacro();
        m.register("1", new c3());
        m.register("2", new c4());
        await m.exec();
        assert.equal(m.size, 2);
        assert.equal(count, 3);
        m.remove("2");
        await m.exec();
        assert.equal(count, 4);
    });
    it('AsyncMacro method execute with async command', async () => {
        count = 0;
        let m : AsyncMacro = new AsyncMacro();
        let a : Args = { val : 1, str: "demo" };
        m.register("1", new ac1());
        m.register("2", new ac1());
        await m.exec(a);
        assert.equal(m.size, 2);
        assert.equal(a.val, 13);
        m.remove("2");
        await m.exec(a);
        assert.equal(m.size, 1);
        assert.equal(a.val, 19);
    }).timeout(3010);
});
