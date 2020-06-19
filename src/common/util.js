// 公共方法
import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const ieVersion = isServer ? 0 : Number(document.documentMode);
const camelCase_regexp = /([\:\-\_])+(.)/g;

const camelCase = function(string) {
    return string.replace(camelCase_regexp, function(name, $1, $2, index) {
        return index ? $2.toUpperCase() : $2
    });
}

export function addClass(el, className) {
    if (!el || isServer || !className) return;
    if (!hasClass(el, className)) {
        if (!el.className) {
            el.className = className;
        } else {
            const classList = el.className.split(" ");
            classList.push(className);
            el.className = classList.join(" ");
        }
    };
};

export function hasClass(el, className) {
    if (!el || isServer || !className) return;
    const classList = el.className.split(" ");
    for(let cls of classList) {
        if (cls === className) {
            return true;
        }
    }
    return false;
}

export function removeClass(el, className) {
    if (!el || isServer || !className) return;
    if (hasClass(el, className)) {
        const classList = el.className.split(" ");
        const newClassList = [];
        for(let cls of classList) {
            if (cls !== className) {
                newClassList.push(cls);
            }
        }
        el.className = newClassList.join(" ");
    }
}
export function getStyle(el, style) {
    if (!el || isServer || !style) return;
    const isVersion = ieVersion < 9;
    style = camelCase(style);
    if (style === 'float') {
        style = isVersion ? 'styleFloat' : 'cssFloat';
    };
    if (style === 'opacity' && isVersion) {
        try {
            return el.filters.item('alpha').opacity / 100;
        } catch (e) {
            return 1.0;
        };
    };

    try {
        if (isVersion) {
            return (el.style[style] || el.currentStyle ? el.currentStyle[style] : null);
        } else {
            return (el.style[style] || document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(el, null)[style] : null);
        };
    } catch (e) {
        return el.style[style];
    };
}

export function afterLeave(instance, callback, speed = 300, once = false) {
    if (!instance || !callback) return;
    let onOff = false;
    function after() {
        if (onOff) return;
        onOff = true;
        callback && callback.apply(null, arguments);
    };

    if (once) {
        instance.$once('after-leave', after);
    } else {
        instance.$once('after-leave', after);
    };

    setTimeout(()=>{
        after();
    }, speed + 100);
}

export const on = (function() {
    if (document.addEventListener) {
        return function(el, event, callback) {
            if (isServer || !el || !event || !callback) return;
            el.addEventListener(event, callback, false);
        }
    } else {
        return function(el, event, callback) {
            if (isServer || !el || !event || !callback) return;
            el.attachEvent('on' + event, callback);
        }
    }
})();

export const off = (function() {
    if (document.removeEventListener) {
        return function(el, event, callback) {
            if (isServer || !el || !event || !callback) return;
            el.removeEventListener(event, callback, false);
        }
    } else {
        return function(el, event, callback) {
            if (isServer || !el || !event || !callback) return;
            el.detachEvent('on' + event, callback);
        }
    }
})();

export function isScroll(el, vertical) {
    if (isServer) return;
    const isVertical = vertical !== undefined && vertical !== null;
    const overflow = isVertical ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow');
    return overflow.match(/(scroll|auto)/);
}

export function getScrollContainer(el, vertical) {
    if (isServer) return;
    let parent = el;
    while(parent) {
        if ([window, document, document.documentElement].includes(parent)) {
            return window;
        };
        
        if (isScroll(parent, vertical)) {
            return parent;
        };

        parent = parent.parentNode;
    };

    return parent;
}

export function isInContainer(el, container) {
    if (isServer || !el || !container) return;

    const elOffset = el.getBoundingClientRect();
    let parentOffset;
    if ([window, document, document.documentElement].includes(container)) {
        parentOffset = {
            top: 0,
            bottom: window.offsetHeight,
            left: 0,
            right: window.offsetWidth
        }
    } else {
        parentOffset = container.getBoundingClientRect();
    };

    return elOffset.top < parentOffset.bottom && elOffset.bottom > parentOffset.top && elOffset.left < parentOffset.right && elOffset.right > parentOffset.left;
}

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay {number} 延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate 参数传递 false 绑定的函数先执行，而不是 delay 后执行。
 * @return {function}实际调用函数
 */
export function throttle(fn, delay, immediate, debounce) {
    let curr = +new Date(); // 当前事件
    let lastCall = 0;
    let lastExec = 0;
    let timer = null;
    let diff; // 时间差
    let context; // 上下文
    let args;
    let exec = function() {
        lastExec = curr;
        fn.apply(context, args);
    };
    return function() {
        curr = +new Date();
        context = this;
        args = arguments;
        diff = curr - (debounce ? lastCall : lastExec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        lastCall = curr;
    };
}

export function debounce(fn, delay, immediate) {
    return this.throttle(fn, delay, immediate, true);
}

export function isFixfox() {
    return !isServer && !!window.navigator.userAgent.match(/firefox/i);
}

export function rethrottle(fn) {
    let lock = false;
    return function(...args) {
        if (lock) return;
        lock = true;
        window.requestAnimationFrame(()=>{
            fn.apply(this, args);
            lock = false;
        })
    }
}