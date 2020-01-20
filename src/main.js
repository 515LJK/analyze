// var evalRPN = function(tokens) {
//     let stack = [];

//     for(let i=0;i<tokens.length;i++) {
//         let current = tokens[i];
//         let nums2, nums1;
//         switch(current) {
//             case '+':
//                 nums2 = stack.pop();
//                 nums1 = stack.pop();
//                 stack.push(nums1 + nums2);
//                 break;
//             case '-':
//                 nums2 = stack.pop();
//                 nums1 = stack.pop();
//                 stack.push(nums1 - nums2);
//                 break;
//             case '/':
//                 nums2 = stack.pop();
//                 nums1 = stack.pop();
//                 stack.push(parseInt(nums1 / nums2));
//                 break;
//             case '*':
//                 nums2 = stack.pop();
//                 nums1 = stack.pop();
//                 stack.push(nums1 * nums2);
//                 break;
//             default:
//                 stack.push(+current);
//                 break;
//         };
//     };

//     return stack[0];
// };

// console.log(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]));

var addTwoNumbers = function(l1, l2) {
    let newTree = {};
    let node;
    let post = 0;
    
    while(l1 || l2) {
        let num = null;
        if (l1) {
            num = l1.val;
            l1 = l1.next;
        };

        if (l2) {
            num += l2.val;
            l2 = l2.next;
        };

        num += post;

        if (num > 9) {
            post = 1;
            num -= 10;
        }else {
            post = 0;
        };

        if (!node) {
            node = newTree;
        };
        
        newTree.val = num;

        if (l1 || l2) {
            newTree.next = newTree = {};
            continue;
        };

        if (post) {
            newTree.next = {
                val: post,
                next: null
            };
            continue;
        };

        newTree.next = null;
    };
    
    return node;
};


let l1 = {
    val: 9,
    next: {
        val: 8,
        next: null
    }
}

let l2 = {
    val: 1,
    next: null
}


console.log(addTwoNumbers(l1,l2));
