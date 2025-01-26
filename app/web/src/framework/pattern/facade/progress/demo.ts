import { IPipeController, Filter, Progress } from "@/framework/pattern/facade/progress";

class F1 extends Filter {
    exec($args: any) : any {
        if ($args !== undefined && $args !== null) {
            $args.val += 5;
        }
        return $args;
    }
}

class F2 extends Filter {
    error ?: any;
    constructor($name : string, $msg ?: any) {
        super($name);
        this.error = $msg;
    }
    exec() : any {
        let pc : IPipeController
        if (!!this.error) {
            pc = { fail: true, data: this.error };
        } else {
            pc = { fail: true };
        }
        return pc;
    }
}

class svc {
    async fetchCount(amount : number) {
        return new Promise<number>((resolve) =>
            setTimeout(() => resolve(amount + 1), 1000)
        );
    }
}

class AF1 extends Filter {
    async exec($args: any) : Promise<any> {
        if ($args !== undefined && $args !== null) {
            let s : svc = new svc();
            $args.valx += await s.fetchCount(5);
        }
        return $args;
    }
}

function onStart(x : any) {
    console.log("--- onStart ---");
    console.log(x);
}

function onComplete(x : any) {
    console.log("--- onComplete ---");
    console.log(x);
}

function onError(x : any) {
    console.log("--- onError ---");
    console.log(x);
}

console.log("----------");

let m : Progress = new Progress();
m.register("1", new F1());
m.register("2", new AF1());
m.attach("onStart", onStart);
m.attach("onComplete", onComplete);
console.log(await m.exec({val: 0, valx: 0}));


console.log("----------");
let m2 : Progress = new Progress();
m2.register("1", new F2("node1", "error message"));
m2.register("2", new F1());
m2.attach("onStart", onStart);
m2.attach("onError", onError);
console.log(await m2.exec({val: 0, valx: 0}));
