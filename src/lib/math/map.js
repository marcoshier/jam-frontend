export function map(value, beforeLeft, beforeRight, afterLeft, afterRight, clamp = false) {
    let result = afterLeft + (afterRight - afterLeft) * ((value - beforeLeft) / (beforeRight - beforeLeft));
    
    if (clamp) {
        const min = Math.min(afterLeft, afterRight);
        const max = Math.max(afterLeft, afterRight);
        result = Math.max(min, Math.min(max, result));
    }
    
    return result;
}