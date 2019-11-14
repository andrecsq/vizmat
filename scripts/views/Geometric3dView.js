class Geometric3dView extends View{
    constructor(params){
      super(params);
      this.size = {w:200,h:200};
      this.matrixName = this._matrixNames[0];
      this.quant = 10;
      this.p5html = $(`<div id="geo3d-p5-${this.matrixName}" style="width: ${this.size.w}px; height: ${this.size.h}px;"></div>`)[0]
      this.onMatrixChange();
      this.step = 10;
      this.htmlContainer=$(this._container.body);
      this.htmlContainer.html(this.p5html);
      this.createP5();
    }


    onMatrixChange(){
     this.matrixEst = this._matrixes[this.matrixName];
    }

    onResize(w, h) {
        this.size = {w:w,h:h};
        this.sk.resizeCanvas(this.size.w,this.size.h);
    }

    createP5(){
      let _this=this;
      this.p5 = new P5(sk=>{
          _this.sk=sk;
          sk.setup=()=>{_this.setupP5(sk);};
          sk.draw=()=>{_this.drawP5(sk);};
      },this.p5html);
    }

    setupP5(sk){
        this.htmlContainer[0].children[0].innerHtml="";
        this.cnv = sk.createCanvas(this.size.w, this.size.h, sk.WEBGL);
        this.cnv.canvas.style.visibility="visible";
        this.cam = sk.createCamera();
        this.cam.setPosition(0, 0, -500);
    }
    
    drawP5(sk){
        sk.orbitControl();
        sk.smooth()
        sk.background(`${Colors.g.bg1}`);
        this.drawGuides(20, 5);
      
      for(let i=0;i<this.matrixEst.size()[1];i++){
          if(this.matrixEst.size()[0]<3){
            this.drawArrow(this.matrixEst.subset(math.index(0,i))*this.step,this.matrixEst.subset(math.index(1,i))*this.step,0,`${Colors.obj[i]}`);
          }else{
            this.drawArrow(this.matrixEst.subset(math.index(0,i))*this.step,this.matrixEst.subset(math.index(1,i))*this.step,this.matrixEst.subset(math.index(2,i))*this.step,`${Colors.obj[i]}`);
          }
      
      }
    }
    
    drawGuides(nLines, space){
        this.sk.push();
        space = space||20;
       this.sk.stroke(this.sk.color("#dddddddd"));
       this.sk.strokeWeight(0.5);
       let start=(nLines%2==0)?(nLines/2):Math.trunc(nLines/2);
       for(let x=(-start);x<start+1;x++){
           this.sk.line(x*space,-(nLines*space)/2,0,x*space,nLines*space/2,0);
           this.sk.line(-(nLines*space)/2,x*space,0,(nLines*space)/2,x*space,0);
       }
       this.sk.strokeWeight(2);
       this.sk.stroke(this.sk.color('#ffffffaa'))
       this.sk.line(0,0,-space*nLines/2,0,0,space*nLines/2);
       this.sk.pop();
    }

    drawArrow(x, y, z, color){
        color = this.sk.color(color);
        this.sk.push();
        this.sk.stroke(color);
        this.sk.strokeWeight(1);
        this.sk.line(0,0,0,x,y,z);
        this.sk.fill(color);
        this.sk.noStroke();
        this.sk.push();
        this.sk.translate(x,y,z);
        this.sk.sphere(2);
        this.sk.pop();
    }
   
  }

define(()=>Geometric3dView);