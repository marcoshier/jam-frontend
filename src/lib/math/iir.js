export class NumberIir {
    constructor(alpha = 0.02, beta = 0.2) {
        this.alpha = alpha;
        this.beta = beta;
        this.last = 0.0;
        this.velocity = 0.0;
        this.dyn = 0.0;
    }

    update(value) {
        this.velocity += (value - this.last) * this.alpha;
        this.velocity += (value - this.dyn) * this.beta;
        this.velocity *= 0.90;

        this.last = value;
        this.dyn += this.velocity;
    }
}
