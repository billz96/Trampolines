const Trampoline = {
    runT(trampoline) {
        let result = trampoline;
        while (typeof result === "function") {
            result = result();
        }
        return result;
    }
};

function goTo(func, ...args) {
    return () => func(...args);
}


// example 1:
function range(start, end, res=[start]) {
    if (start === end) {
        return res;
    } else {
        return goTo(range, start + 1, end, [...res, start + 1]);
    }
}

let res1 = Trampoline.runT(range(5,10));
console.log(`res1: ${res1}\n`);


// example 2:
function times(x, func) {
    if (x == 0) {
        return func(x);
    } else {
        func(x);
        return goTo(times, x - 1, func); 
    }
}

let res2 = Trampoline.runT(times(5, (x) => console.log(`x: ${x}\n`)));
console.log(`res2: ${res2}\n`);


// example 3:
function xrange(start, end, step=1, res=[start]) {
    if (start < end) {
        return goTo(xrange, start + step, end, step, [...res, start + step]);
    } else {
        return res
    }
}

let res3 = Trampoline.runT(xrange(0,25,5));
console.log(`res3: ${res3}\n`);


// example 4:
function factorial(x, res=[x]) {
    if (x == 0 || x == 1) {
        return res.reduce((a,b) => a * b, 1);
    } else {
        return goTo(factorial, x-1, [...res, x-1]);
    }
}

let res4 = Trampoline.runT(factorial(10));
console.log(`res4: ${res4}`);


// example 5:
function fibonacci(x) {
    if (x == 1) return 1;
    else return goTo(fibonacci, x - 2);
}


// example 6:
function isPrime(n, divisor = 2) {
    if (n < 2 || (n > 2 && n % divisor == 0)) {
        return false;
    }

    if (divisor <= Math.sqrt(n)) {
        return goTo(isPrime, n, divisor + 1);
    }

    return true;
}


// example 7: array methods part 1
function sum(nums, res=0) {
    if (nums.length == 0) {
        return res;
    } else {
        let num = nums.shift();
        return goTo(sum, nums, res+num);
    }
}


// example 8: array methods part 2
function product(nums, res=1) {
    if (nums.length == 0) {
        return res;
    } else {
        let num = nums.shift();
        return goTo(product, nums, res * num);
    }
}


// example 9: Mutual recursive functions
function isOdd(v) {
    if (v === 0) return false;
    return goTo(isEven, Math.abs(v) - 1);
}

function isEven(v) {
    if (v === 0) return true;
    return goTo(isOdd, Math.abs(v) - 1);
}


// example 10: array methods part 3
function len(array, res=0) {
    if (!array.shift()) {
        return res
    } else {
        return goTo(len, array, res + 1);
    }
}

function sleep(millisecs, stopTime = new Date().getTime() + millisecs) {
    const currentTime = new Date().getTime();
    if (currentTime >= stopTime) {
        return;
    } else {
        return goTo(sleep, millisecs, stopTime);
    }
}

function doAfter(millisecs, func, stopTime = new Date().getTime() + millisecs) {
    const currentTime = new Date().getTime();
    if (currentTime >= stopTime) {
        func();
        return;
    } else {
        return goTo(doAfter, millisecs, stopTime, func);
    }
}

function doEvery(millisecs, func, lastTimestamp = new Date().getTime() + millisecs) {
    const currentTime = new Date().getTime();
    if (active) {
        if (currentTime - lastTimestamp >= millisecs) {
            result = func();
            if (!result) return goTo(doEvery, millisecs, currentTime, func);
            return result;
        } else {
            return goTo(doEvery, millisecs, currentTime, func);
        }
    }
}

// example 11: vdom lib
// ...