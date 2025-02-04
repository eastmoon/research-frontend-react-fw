// Test framework Library
import { assert } from "chai";

// Application framework Library
import { IProxy, Service, Proxy } from "@/framework/pattern/proxy";
import { IPublisher, Publisher } from "@/framework/pattern/observer";
import { Container } from "@/framework/pattern/facade/container";

// Declare variable
let data : any = { str: "123", val: 321 };
let count = 0;

// Declare class
class SubService extends Service {
    demo($args : any) {
        return { xstr: $args.str, xval : $args.val };
    }
}
class AsyncSubService extends Service {
    fetchCount(amount : number) {
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(amount + 1), 1000)
      );
    }
    async load($args : any) {
        if ( typeof $args === "number" && $args > 0 ) {
            return await this.fetchCount(5);
        }
        return null;
    }
}
class ProxyDemo1 extends Proxy {
    success($args : any) {
        if ( typeof $args === "number" && $args > 0 ) {
            return $args;
        }
        return null;
    }
    fail($args : any) {
        throw new TypeError($args);
    }
}
class ProxyDemo2 extends Proxy {
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
class ProxyDemo3 extends Proxy {
    async calc($args : any) {
        if ( typeof $args === "number" && $args > 0 ) {
            this.notify("calc", $args);
            return $args;
        }
        return null;
    }
}
let f1 = (x : any) => {
    count += (Number(x) + 1);
}
let f2 = (x : any) => {
    count += (Number(x) + 2);
}

// Test case
describe('Framework.Pattern.Proxy Tests', () => {
    it('Service interface', () => {
        let o : IProxy = new Service();
        assert.property(o, "op");
        assert.typeOf(o.op, "function");
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
    });
    it('Service run undeclared operation', () => {
        let o : IProxy = new Service();
        let res : any = o.op("demo", data);
        assert.isNull(res);
    });
    it('Service run operation', () => {
        let o : IProxy = new SubService();
        let res : any = o.op("demo", data);
        assert.isNotNull(res);
        assert.property(res, "xstr");
        assert.equal(res.xstr, data.str);
        assert.property(res, "xval");
        assert.equal(res.xval, data.val);
    });
    it('Service run async/await operation', async () => {
        let o : IProxy = new AsyncSubService();
        let res : any = await o.op("load", 5);
        assert.isNotNull(res);
        assert.equal(res, 6);
    }).timeout(1010);
    it('Proxy interface', () => {
        let o : IProxy = new Proxy();
        assert.property(o, "op");
        assert.typeOf(o.op, "function");
        assert.property(o, "name");
        assert.typeOf(o.name, "string");
    });
    it('Proxy has Publisher method', () => {
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
    it('Proxy has container method', () => {
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
    it('Proxy run undeclared operation', async () => {
        let res : any = null;
        try {
          let p : IProxy = new ProxyDemo1();
          let res : any = await p.op("unknow", 123);
          assert.fail("Proxy must return null.");
        } catch (error) {
          assert.include(error, "null");
          assert.isNull(res);
        }
    });
    it('Proxy run operation with promise then/catch structure', () => {
        let o : IProxy = new ProxyDemo1();
        o.op("success", 123)
            .then((response: any) => {
                assert.isNotNull(response);
                assert.equal(response, 123);
            })
            .catch((error: any) => {
                assert.fail("Proxy return null or operation failed run.");
            });
    });
    it('Proxy run operation with async/await', async () => {
        try {
          let p : IProxy = new ProxyDemo1();
          let res : any = await p.op("success", 123);
          assert.isNotNull(res);
          assert.equal(res, 123);
        } catch (error) {
          assert.fail("Proxy return null or operation failed run.");
        }
    });
    it('Proxy run operation with async/await, but operation run failed.', async () => {
        let res : any = null;
        try {
          let p : IProxy = new ProxyDemo1();
          let res : any = await p.op("fail", 123);
          assert.fail("Proxy operation must failed.");
        } catch (error) {
          assert.include(error, "123");
          assert.isNull(res);
        }
    });
    it('Proxy run operation with async/await, and loading more than 1s.', async () => {
        let res : any = null;
        try {
          let p : IProxy = new ProxyDemo2();
          let res : any = await p.op("load", 123);
          assert.isNotNull(res);
          assert.equal(res, 124);
        } catch (error) {
          assert.fail("Proxy return null or operation failed run.");
        }
    }).timeout(1010);
    it('Proxy run operation with async/await, and operation will notify.', async () => {
        let res : any = null;
        try {
          let p : Proxy = new ProxyDemo3();
          p.attach("calc", f1);
          p.attach("calc", f2);
          assert.equal(p.size, 1);
          count = 0;
          let res : any = await p.op("calc", 1);
          assert.isNotNull(res);
          assert.equal(res, 1);
          assert.equal(count, 5)
        } catch (error) {
          console.log(error);
          assert.fail("Proxy return null or operation failed run.");
        }
    });
});
