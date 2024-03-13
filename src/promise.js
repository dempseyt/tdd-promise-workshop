const PENDING_STATE = "PENDING_STATE";
const FULFILLED_STATE = "FULFILLED_STATE";
const REJECTED_STATE = "REJECTED_STATE";

function MyPromise(executor = () => {}) {
    this.then = (functionToCallWhenPromiseIsResolved) => {
        if(this.state == FULFILLED_STATE) {
            functionToCallWhenPromiseIsResolved(this.result)
        } else if (this.state == REJECTED_STATE) {} 
        else {
            this.functionToCallWhenPromiseIsResolved = 
                functionToCallWhenPromiseIsResolved;
        }
    
    };
    
    this.functionToResolvePromise = (result) => {
        this.state = FULFILLED_STATE;
        this.result = result;
        if (this.functionToCallWhenPromiseIsResolved) {
            this.functionToCallWhenPromiseIsResolved(result)
        }
    };
    
    this.state = PENDING_STATE;
    executor(this.functionToResolvePromise);
}
export default MyPromise;