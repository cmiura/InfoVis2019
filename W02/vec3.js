//Constructor
Vec3 = function(x,y,z)
{
    this.x=x;
    this.y=y;
    this.z=z;
}

//Add method
Vec3.prototype.add=function(v)
{
    this.x +=v.x;
    this.y +=v.y;
    this.z +=v.z;
    return this;
}

//Sub method
Vec3.prototype.sub=function(v)
{
    var x=v.x-this.x;
    var y =v.y-this.y;
    var z =v.z-this.z;
    
    console.log(this.x);
    console.log(this.y);
    console.log(this.z);

    return new Vec3(x,y,z);
}

//Multi method
Vec3.prototype.mult=function()
{
    var x =Math.pow(this.x,2);
    var y =Math.pow(this.y,2);
    var z =Math.pow(this.z,2);
    return new Vec3(x,y,z);
}

//Sum method
Vec3.prototype.sum=function()
{
    return this.x + this.y + this.z;
}

//Min method
Vec3.prototype.min=function()
{
    var min=this.x;
    if(min >= this.y){ min=this.y;}
    if(min >= this.z){ min=this.z;}
    return min;
}


//Max method
Vec3.prototype.max=function(){
    var max=this.x;
    if(this.y >= max){ max=this.y;}
    if(this.z >= max){ max=this.z;}
    return max;
}

//Mid method
Vec3.prototype.mid=function(){
    var mid;
    var Min=this.min();
    var Max=this.max();
    if(this.x!=Min && this.x!=Max){ mid=this.x;}
    if(this.y!=Min && this.y!=Max){ mid=this.y;}
    if(this.z!=Min && this.z!=Max){ mid=this.z;}
    return mid;
}


//Calculate area
function AreaOfTriangle(v0,v1,v2){
    var xy=v0.sub(v1);
    var xz=v0.sub(v2);
    
    console.log(xy);
    console.log(xz);
    var a=xy.mult().sum();
    var b=xz.mult().sum();
    
    console.log(a);
    console.log(b);
    
    var ab=Math.pow((xy.x*xz.x + xy.y*xz.y + xy.z*xz.z),2);
    
    var s=(Math.sqrt(a*b-ab))/2
    
    console.log(ab);
    return s;
}

function calculate(){
            
            var x0=parseInt(document.getElementById("x0").value);
            var y0=parseInt(document.getElementById("y0").value);
            var z0=parseInt(document.getElementById("z0").value);
            
            var x1=parseInt(document.getElementById("x1").value);
            var y1=parseInt(document.getElementById("y1").value);
            var z1=parseInt(document.getElementById("z1").value);
            
            var x2=parseInt(document.getElementById("x2").value);
            var y2=parseInt(document.getElementById("y2").value);
            var z2=parseInt(document.getElementById("z2").value);
       
            
            var v0=new Vec3(x0,y0,z0);
            var v1=new Vec3(x1,y1,z1);
            var v2=new Vec3(x2,y2,z2);
            
            console.log(v0);
            console.log(v1);
            console.log(v2);
    
            var S=AreaOfTriangle(v0,v1,v2);
            document.getElementById("target").innerHTML="s="+S;
            }