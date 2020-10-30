function promise(fn) {
    this.state = 'pending';
    this.callbacks = [];
    this.value = null;
    try {
        fn(this.resolve.bind(this), this.reject.bind(this));
    }catch(e) {
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

// new Promise(res=>{
//     throw 123;
// }).then(num=>{

// }).catch(err=>[
//     console.log(err)
// ])

// function fn1(fn) {
//     console.log(1)
//     fn()
// }

// function fn2(fn) {
//     console.log(2);
//     fn()
// }

// function fn3(fn) {
//     console.log(3);
//     fn()
// }

// const cb = [fn1, fn2, fn3];

// let next = function() {};

// function createNext(fn, next) {
//     return function() {
//         fn(next)
//     }
// }

// for(let i=0;i<cb.length;i++) {
//     next = createNext(cb[i], next);
// }

// next()

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

