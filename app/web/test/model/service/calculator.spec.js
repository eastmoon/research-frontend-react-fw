import { assert } from "chai";
import { addition } from "@/model/service/calculator";
describe("Calculator Tests", () => {
    it("should return 5 when 2 is added to 3", () => {
        const result = addition(2, 3);
        assert.equal(result, 5);
    });
});
//# sourceMappingURL=calculator.spec.js.map