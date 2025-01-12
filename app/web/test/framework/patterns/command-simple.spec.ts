// Test framework Library
import { assert } from "chai";

// Application framework Library
import { ICommand, Simple } from "@/framework/pattern/command";

// Declared class or variable
interface Args {
    val : number;
    str : string;
}

// Test case
describe('DEV Framework.Pattern.Command Tests', () => {
    it('Simple Command interface', () => {
        let c : ICommand = new Simple();
        assert.property(c, "name");
        assert.typeOf(c.name, "string");
        assert.property(c, "execute");
        assert.typeOf(c.execute, "function");
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
        let r : Args = c.execute(a);
        assert.property(r, "val");
        assert.typeOf(r.val, "number");
        assert.equal(r.val, 1);
        assert.property(r, "str");
        assert.typeOf(r.str, "string");
        assert.equal(r.str, "demo");
    });
    it('Inherit Simple command and execute', () => {
        class cc extends Simple {
            execute($args: any) : any {
                if ($args !== undefined && $args !== null) {
                    $args.val += 1;
                }
                return $args;
            }
        }
        let c : ICommand = new cc();
        let a : Args = { val : 1, str : "demo" };
        c.execute(a);
        assert.property(a, "val");
        assert.typeOf(a.val, "number");
        assert.equal(a.val, 2);
        c.execute(a);
        assert.property(a, "val");
        assert.typeOf(a.val, "number");
        assert.equal(a.val, 3);
        c.execute();
    });
});
