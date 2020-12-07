const _Class = (function() {
    function constructor(name) {
        this.name = name;
    }

    constructor.prototype.show = function() {
        console.log(this.name)
    }
    return constructor;
})();

const _extends = (function(parent = null) {
    if (parent) {
        constructor.prototype = Object.create(parent.prototype, {
            constructor: {
                value: constructor,
                configurable: true,
                emumerable: false,
                writable: true
            }
        });
        constructor.__proto__ = parent;
    }
    function constructor(name) {
        this.name = name;
    }

    constructor.prototype.show = function() {
        console.log(this.name)
    }
    return constructor;
})();

// const arr = [
//     [1,2,4,7],
//     [3,5,8,10],
//     [6,9,11,12]
// ]
// function slope(arr) {
//     const col = arr.length;
//     const row = arr[0].length;
//     const res = [];
//     for(let i = 0; i < col; i++) {
//         for(let j = 0; j < row; j++) {
//            const sum = i + j;
//            const current = arr[i][j];
//            res[sum] ? res[sum].push(current) : res[sum] = [current]; 
//         }
//     }
//     return res.flat(Infinity);
// }

// console.log(slope(arr));

const resolved = Promise.resolve(42);

const allSettledPromise = allSettled([resolved]);

// allSettledPromise.then(function (results) {
//   console.log(results);
// });

function allSettled(promises) {
    return new Promise((res)=>{
        const len = promises.length;
        let finish = 0;
        for(let promise of promises) {
            promise.finally(()=>{
                finish++;
                if (finish === len) {
                    res(promises);
                }
            });
        }
    });
}

