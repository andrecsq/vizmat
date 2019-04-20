class FunctionView extends View{
  constructor(param){
    super(param);
    this.est=this._matrixes;
    this.radius=10;
    
    this.matrixName = this._matrixNames[0];
    this.size = {h:200,w:200};
    this.colors = [];
    this.onMatrixChange();
    this.quant = this.matrixEst.size()[1];
    this.height_lo = Math.ceil(Math.abs(Math.min(0,math.min(this.matrixEst))));
    this.height_hi = Math.ceil(math.max(this.matrixEst));
    this.height = this.height_hi + this.height_lo;
    this.center = {hor:Math.max(10,this.step.x/2), ver: (this.height_hi+1)*this.size.h/(this.height+2)};
    this.dragging= [-1,-1];
    this.step={x: (this.size.w-10)/this.matrixEst.size()[0]
               , y: (this.size.h-10)/(this.height+1) };
    
    this.p5html = $(`<div id="p5-${this.matrixName}-${uuid()}" style="width: ${this.size.w}px; height: ${this.size.h}px;"></div>`);
    this.createP5();
    this.grids= 10;
    
    this.htmlContainer=this._container.body;
    this.htmlContainer.append(this.p5html[0]);
  }

  onResize(w, h) {
    this.size = {w:w,h:h};
    this.sk.resizeCanvas(this.size.w,this.size.h);
  }

  onMatrixChange(){
    this.matrixEst = this.est[this.matrixName];
    this.step={x: (this.size.w-10)/this.matrixEst.size()[0]
               , y: (this.size.h-10)/(this.height+1) };
  }
  
  onMoveStart(sk){
    if (this.dragging[0] == -1 && this.dragging[1] == -1){
      let p = this.calcPoint(sk.mouseX, sk.mouseY);
      for (let i = 0; i < this.matrixEst.size()[0]; i++)
        for (let j = 0; j < this.matrixEst.size()[1]; j++){
          if (sk.dist(p.x, p.y, i*this.step.x,
                      this.matrixEst.subset(math.index(i,j))*this.step.y)<=this.radius){
            this.dragging = [i,j];
          }
        }
    }
  }

  onMoveEnd(sk){
    this.dragging = [-1,-1];
  }

  createP5(){
    let _this=this;
    this.p5 = new P5(sk=>{
      _this.sk=sk;
      sk.setup=()=>{_this.setupP5(sk);};
      sk.draw=()=>{_this.drawP5(sk);};
    },this.p5html[0]);
  }
  setupP5(sk){
    let _this=this;
    this.cnv = sk.createCanvas(this.size.w, this.size.h);
    this.cnv.canvas.style.visibility="visible";
    sk.angleMode(sk.DEGREES);
    
    this.cnv.touchStarted(()=>this.onMoveStart(sk)); 
    this.cnv.mousePressed(()=>this.onMoveStart(sk));
    this.cnv.mouseReleased(()=>this.onMoveEnd(sk));
    this.cnv.touchEnded(()=>this.onMoveEnd(sk));
  }
  
  drawP5(sk){
    sk.background(Colors.g.bg1);
    sk.scale(1, -1);
    sk.translate(this.center.hor,-this.center.ver);
    this.drawGuides(sk, Colors.g.fg1, 0.3, {x: 1, y: 0}, {x: 0, y: 1});   
    
    for (let i = 0; i < this.matrixEst.size()[1]; i++){   
      sk.noStroke();
      let c = sk.color(`${Colors.obj[i]}`);
      sk.fill(c);
      
      for (let j = 0; j < this.matrixEst.size()[0]; j++){ 
        if (this.dragging[0] == j && this.dragging[1] == i){
          this.matrixEst.subset(math.index(j, i),
            trunca(this.calcPoint(sk.mouseX, sk.mouseY).y/this.step.y));
          this.est[this.matrixName] = this.est[this.matrixName];
        }
        sk.ellipse(j*this.step.x, this.matrixEst.subset(math.index(j,i))*this.step.y, this.radius);
      }
       
    }
  }
  
  drawGuides(sk, color, weight, i_go, j_go){
    sk.stroke(color);   
    sk.strokeWeight(weight);

    for (let i = -(this.height_lo+1); i <= (this.height_hi+1); i++){
      // linhas horizontais (centro em x = 0)      
      sk.push(); 
      sk.translate(i*j_go.x*this.step.x, i*j_go.y*this.step.y);
      if (i == 0) sk.strokeWeight(weight*3);
      sk.line(this.size.w, 0, -this.size.w, 0);  
      sk.pop(); 
    } 
  
    sk.strokeWeight(weight*3);
    sk.line(0, this.size.h, 0, -this.size.h);
  }

  calcPoint(x,y){
    return {x:(x - this.center.hor),y:(-y + this.center.ver)};
  }
}

define(()=>FunctionView);