export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(v) { 
        return new Vector2(this.x + v.x, this.y + v.y); 
    }
    
    sub(v) { 
        return new Vector2(this.x - v.x, this.y - v.y); 
    }
    
    mul(s) { 
        return new Vector2(this.x * s, this.y * s); 
    }
    
    addMut(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    
    subMut(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    
    mulMut(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    
    setFrom(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    length() { 
        return Math.sqrt(this.x * this.x + this.y * this.y); 
    }
    
    normalize() { 
        const len = this.length();
        return len > 0 ? new Vector2(this.x / len, this.y / len) : new Vector2(0, 0);
    }
    
    normalizeMut() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }
    
    distance(v) { 
        return this.sub(v).length(); 
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    perpCCW() {
        return new Vector2(-this.y, this.x);
    }
    
    perpCW() {
        return new Vector2(this.y, -this.x);
    }

    scale(origin, amount) {
        const translated = this.sub(origin);
        const scaled = translated.mul(amount);
        return scaled.add(origin);
    }
}