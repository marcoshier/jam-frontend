export class Noise1D {
    constructor() {
        this.MAX_VERTICES = 256;
        this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
        this.amplitude = 1;
        this.scale = 1;
        
        this.r = [];
        for (let i = 0; i < this.MAX_VERTICES; ++i) {
            this.r.push(Math.random());
        }
    }
    
    getVal(x) {
        const scaledX = x * this.scale;
        const xFloor = Math.floor(scaledX);
        const t = scaledX - xFloor;
        const tRemapSmoothstep = t * t * (3 - 2 * t);
        
        const xMin = xFloor & this.MAX_VERTICES_MASK;
        const xMax = (xMin + 1) & this.MAX_VERTICES_MASK;
        
        const y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);
        
        return y * this.amplitude;
    }
    
    lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }
    
    setAmplitude(newAmplitude) {
        this.amplitude = newAmplitude;
    }
    
    setScale(newScale) {
        this.scale = newScale;
    }
}