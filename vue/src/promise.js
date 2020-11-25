function promise(fn) {
    this.state = 'pending';
    this.callbacks = [];
    this.value = null;
    try {
        fn(this.resolve.bind(this), this.reject.bind(this));
    }catch(error) {
        this.reject(error);
    }
}

promise.prototype = {
    constructor: promise,
    then(onfullfilled, onrejected) {
        return new promise((resolve, reject)=>{
            this.handle({
                onfullfilled,
                resolve,
                onrejected,
                reject
            });
        });
    },
    resolve(newVal) {
        const fn = () => {
            if (this.state !== 'pending') return;
            if (newVal && (typeof newVal === 'function' || typeof newVal === 'object')) {
                const {then} = newVal;
                if (typeof then === 'function') {
                    then.call(newVal, this.resolve.bind(this), this.reject.bind(this));
                    return;
                }
            }
            this.state = 'fullfilled';
            this.value = newVal;
            this.handleCb();
        };
        setTimeout(fn, 0);
    },
    reject(error) {
        const fn = () => {
            if (this.state !== 'pending') return;
            if (error && (typeof error === 'function' || typeof error === 'object')) {
                const {then} = error;
                if (typeof then === 'function') {
                    then.call(error, this.resolve.bind(this), this.reject.bind(this));
                    return;
                }
            }
            this.state = 'rejected';
            this.value = error;
            this.handleCb();
        }
        setTimeout(fn, 0);
    },
    handleCb() {
        while(this.callbacks.length) {
            const callback = this.callbacks.shift();
            this.handle(callback)
        }
    },
    handle(obj) {
        if (this.state === 'pending') {
            this.callbacks.push(obj);
            return;
        }
        const next = this.state === 'fullfilled' ? obj.resolve : obj.reject;
        const cb = this.state === 'fullfilled' ? obj.onfullfilled : obj.onrejected;
        if (!cb) {
            next(this.value);
            return;
        }
        try {
            const ret = cb(this.value);
            next(ret);
        } catch (err) {
            obj.reject(e);
        }
    },
    catch(onError) {
        this.then(null, onError);
    }
}


function fn1(fn) {
    console.log(1)
    fn()
    console.log(1)
}

function fn2(fn) {
    console.log(2);
    fn()
    console.log(2)
}

function fn3(fn) {
    console.log(3);
    fn()
    console.log(3)
}

// compose([fn1, fn2, fn3]);

function compose(cbs) {
    let next = function() {};
    const createNext = function(fn, next) {
        return function() {
            fn(next);
        }
    }
    for(let cb of cbs) {
        next = createNext(cb, next);
    }
    next();
}

// class Parent {
//     constructor() {
//         this.name = 'parent';
//     }
//     test() {
//         console.log(this);
//     }
// }

// class Child extends Parent {
//     constructor() {
//         super();

//     }
// }

// function Parent() {
//     this.name = 'parent'
// }

// Parent.prototype.getName = function() {
//     console.log(this.name);
// }

// function Child() {
//     Parent.call(this);
// }


// const temp = Object.create(Parent.prototype);
// temp.constructor = Child;
// Child.prototype = temp;
// const child = new Child();

