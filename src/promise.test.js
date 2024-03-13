import MyPromise from "./promise"

describe("MyPromise", () => {
    it("should be a constructor", () => {
        expect(typeof MyPromise).toBe('function');
    });
    it("should contain a then method", () => {
        const myPromise = new MyPromise();
        expect(typeof myPromise.then).toBe('function');
    });
    it("should resolve with a value", () => {
        const executor = (resolve) => {
            resolve(6);
        }
        const myPromise = new MyPromise(executor);
        const functionToCallWhenPromiseIsResolved = jest.fn();
        myPromise.then(functionToCallWhenPromiseIsResolved);
        expect(functionToCallWhenPromiseIsResolved).toHaveBeenCalledWith(6)
    });
});