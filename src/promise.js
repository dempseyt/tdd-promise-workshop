const PENDING_STATE = "PENDING_STATE";
const FULFILLED_STATE = "FULFILLED_STATE";
const REJECTED_STATE = "REJECTED_STATE";

function MyPromise(executor = () => {}) {
    this.then = (functionToCallWhenPromiseIsResolved, functionToCallWhenPromiseIsRejected) => {
        if(this.state == FULFILLED_STATE) {
            functionToCallWhenPromiseIsResolved(this.result);
        } else if (this.state == REJECTED_STATE) {
            functionToCallWhenPromiseIsRejected(this.result);
        } 
        else {
            this.functionToCallWhenPromiseIsResolved = 
            functionToCallWhenPromiseIsResolved;
            this.functionToCallWhenPromiseIsRejected = 
                functionToCallWhenPromiseIsRejected;
        }
    
    };
    
    this.functionToResolvePromise = (result) => {
        this.state = FULFILLED_STATE;
        this.result = result;
        if (this.functionToCallWhenPromiseIsResolved) {
            this.functionToCallWhenPromiseIsResolved(result)
        }
    };

    this.functionToRejectPromise = (result) => {
        this.state = REJECTED_STATE;
        this.result = result;
        if(this.functionToCallWhenPromiseIsRejected) {
            this.functionToCallWhenPromiseIsRejected(result);
        }
    };


    this.state = PENDING_STATE;
    executor(this.functionToResolvePromise, this.functionToRejectPromise);
}

MyPromise.resolve = (result) => {
    const executor = (functionToResolvePromise) => {
        functionToResolvePromise(result);
    };
    return new MyPromise(executor);
};

MyPromise.reject = (result) => {
    const executor = (functionToResolvePromise, functionToRejectPromise) => {
        functionToRejectPromise(result);
    };
    return new MyPromise(executor);
}

MyPromise.all = function (arrayOfPromises) {
    const arrayOfResults = new Array(arrayOfPromises.length);
    let rejectedPromiseResult;
    let isRejected = false;

    for (let i = 0; i < arrayOfPromises.length && !isRejected; i++) {
        arrayOfPromises[i].then((resolvedValue) => {
            arrayOfResults.splice(i, 1, resolvedValue);
        }, 
        (rejectValue) => {
            rejectedPromiseResult = MyPromise.reject(rejectValue);
            isRejected = true
        });
    };
    return rejectedPromiseResult ? rejectedPromiseResult : MyPromise.resolve(arrayOfResults);
    
};

export default MyPromise;