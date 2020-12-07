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

var minWindow = function(s, t) {
    let res = [];
    let needs = {};
    let windows = {};
    let right = 0;
    let left = 0;
    let size = t.length;
    let vaild = 0;
    let min = Number.MAX_SAFE_INTEGER;
    for(let text of t) {
        needs[text] ? needs[text]++ : needs[text] = 1;
    }
    while(right < s.length) {
        const rights = s[right];
        if (needs[rights]) {
            windows[rights] ? windows[rights]++ : windows[rights] = 1;
            if (windows[rights] === needs[rights]) vaild++;
        }
        if (vaild === size) {
            while(left <= right) {
                const lefts = s[left];
                const len = right - left;
                if (needs[lefts]) windows[lefts]--;
                if (windows[lefts] < needs[lefts]) {
                    if (len < min) {
                        min = len;
                        res = s.slice(left, right + 1);
                    }
                    vaild--;
                    break;
                }
                left++;
            }
        }
        right++;
    }
    return res;
};

console.log(minWindow('ADOBECODEBANC', 'ABC'));

