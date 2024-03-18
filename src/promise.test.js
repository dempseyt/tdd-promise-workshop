import MyPromise from "./promise"
jest.spyOn(global, 'setTimeout');

describe("MyPromise", () => {
    it("should be a constructor", () => {
        expect(typeof MyPromise).toBe('function');
    });
    it("should contain a then method", () => {
        const myPromise = new MyPromise();
        expect(typeof myPromise.then).toBe('function');
    });
    describe("given a promise that resolves", () => {
        describe("immediately", () => {
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
        describe("after some time", () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });
            afterAll(() => {
                jest.useRealTimers();
            });
            describe("and the callback is registered before it resolves", () => {
                it("calls the registered callback when it resolves", () => {
                    const executor = (resolveFunction) => {
                        setTimeout(() => {
                            resolveFunction(1);
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    const functionToCallWhenPromiseIsResolved = jest.fn();
                    myPromise.then(functionToCallWhenPromiseIsResolved);
                    jest.runAllTimers();
                    expect(functionToCallWhenPromiseIsResolved).toHaveBeenCalledWith(1)
                });
            });
            describe("and the callback is registered after it resolves", () => {
                it("calls the registered callback immediately", () => {
                    const executor = (resolve) => {
                        setTimeout(() => {
                            resolve("This has resolved");
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    const functionToCallWhenPromiseIsResolved = jest.fn();
                    jest.runAllTimers();
                    myPromise.then(functionToCallWhenPromiseIsResolved);
                    expect(functionToCallWhenPromiseIsResolved).toHaveBeenCalledWith("This has resolved")
                });
            });
        });
    });
    describe("given a promise that rejects", () => {
        describe("immediately", () => {
            it("calls the registered callback", () => {
                const executor = (resolve, reject) => {
                    reject("Rejected");
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseRejects = jest.fn();
                myPromise.then(undefined, functionToCallWhenPromiseRejects);
                expect(functionToCallWhenPromiseRejects).toHaveBeenCalledWith("Rejected");
            });
        });
        describe("after some time", () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });
            afterAll(() => {
                jest.useRealTimers();
            });
            describe("and the callback is registered before it rejects", () => {
                it("should call the callback after it rejects", () => {
                    const functionToCallWhenPromiseRejects = jest.fn();
                    const executor = (resolve, reject) => {
                        setTimeout(() => reject(), 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    myPromise.then(undefined, functionToCallWhenPromiseRejects)
                    jest.runAllTimers();
                    expect(functionToCallWhenPromiseRejects).toHaveBeenCalled();
                });
            });
            describe("and the callback is registered after it rejects", () => {
                it("should call the registered callback immediately", () => {
                    const executor = (resolve, reject) => {
                        setTimeout(() => {
                            reject('Reject');
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    jest.runAllTimers();
                    const functionToCallWhenPromiseRejects = jest.fn();
                    myPromise.then(undefined, functionToCallWhenPromiseRejects);
                    expect(functionToCallWhenPromiseRejects).toHaveBeenCalledWith('Reject');
                });
            });
        });
        it("returns a promise that is immediately resolved to a value", () => {
            const resolvedPromise = MyPromise.resolve("Resolved");
            expect(resolvedPromise).toBeInstanceOf(MyPromise);
            expect(resolvedPromise.state).toBe('FULFILLED_STATE');
        })
    });
});