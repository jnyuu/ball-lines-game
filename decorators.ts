export function logNext(target: any, name: string, descriptor: any) {
    var originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        var result = originalMethod.apply(this, args);
        return result;
    }
}
// export function logPathLength(target: any, name: string, descriptor: any) {
//     // //(target);x
//     // //(descriptor);
//     var originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//         var result = originalMethod.apply(this, args);
//         // //();
//         document.getElementById("pathLength").innerHTML = "Długość podświetlonego to : " + args[0].length.toString() + "";
//         return result;
//     }
// }
