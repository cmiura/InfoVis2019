function main(){

    var scene=new THREE.Scene();
    
    var width=500;
    var height=500;
    var fov=45;
    var aspect=width/height;
    var near=1;
    var far=1000;
    var camera=new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(0,0,5);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    document.body.appendChild( renderer.domElement );

   var vertices=[
       [-1,1,-1],  //v0
       [-1,-1,-1], //v1
       [1,-1,-1],   //v2
       [1,1,-1],   //v3
       [-1,1,1],  //v4
       [-1,-1,1], //v5
       [1,-1,1],   //v6
       [1,1,1],   //v7
   ];

   var v0= new THREE.Vector3().fromArray( vertices[0] );
   var v1= new THREE.Vector3().fromArray( vertices[1] );
   var v2= new THREE.Vector3().fromArray( vertices[2] );
   var v3= new THREE.Vector3().fromArray( vertices[3] );
   var v4= new THREE.Vector3().fromArray( vertices[4] );
   var v5= new THREE.Vector3().fromArray( vertices[5] );
   var v6= new THREE.Vector3().fromArray( vertices[6] );
   var v7= new THREE.Vector3().fromArray( vertices[7] );
 
   var f0=new THREE.Face3( 0,2,1 );
   var f1=new THREE.Face3( 0,3,2 );
   var f2=new THREE.Face3( 4,5,6 );
   var f3=new THREE.Face3( 4,6,7 );
   var f4=new THREE.Face3( 0,4,7 );
   var f5=new THREE.Face3( 0,7,3 );
   var f6=new THREE.Face3( 1,6,5 );
   var f7=new THREE.Face3( 1,2,6 );
   var f8=new THREE.Face3( 3,7,6 );
   var f9=new THREE.Face3( 3,6,2 );
   var f10=new THREE.Face3( 0,5,4 );
   var f11=new THREE.Face3( 0,1,5 );

   var geometry= new THREE.Geometry();
   geometry.vertices.push(v0);
   geometry.vertices.push(v1);
   geometry.vertices.push(v2);
   geometry.vertices.push(v3);
   geometry.vertices.push(v4);
   geometry.vertices.push(v5);
   geometry.vertices.push(v6);
   geometry.vertices.push(v7);

   geometry.faces.push(f0);
   geometry.faces.push(f1);
   geometry.faces.push(f2);
   geometry.faces.push(f3);
   geometry.faces.push(f4);
   geometry.faces.push(f5);
   geometry.faces.push(f6);
   geometry.faces.push(f7);
   geometry.faces.push(f8);
   geometry.faces.push(f9);
   geometry.faces.push(f10);
   geometry.faces.push(f11);

   var material = new THREE.MeshBasicMaterial();
   material.vertexColors = THREE.FaceColors;
   

   var box= new THREE.Mesh(geometry,material);
   scene.add(box);

   loop();

    function loop()
    {
        requestAnimationFrame( loop );
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render( scene, camera );
    }

    //mousedownしたらmouse_down_eventをやってねの命令
    document.addEventListener( 'mousedown', mouse_down_event );

    function mouse_down_event( event )
    {
         //eventが出た時のマウスのx,y座標
        var x_win = event.clientX;
        var y_win = event.clientY;

        //マウスの座標を正規化
        var vx=renderer.domElement.offsetLeft;
        var vy=renderer.domElement.offsetTop;
        var vw=renderer.domElement.width;
        var vh=renderer.domElement.height;
        var x_NDC=2*(x_win - vx )/ vw-1;
        var y_NDC=-(2 *(y_win-vy) / vh-1);

        //マウスの位置ベクトル
        var p_NDC=new THREE.Vector3(x_NDC,y_NDC,1);

        //p_NDCはスクリーン座標系なので、オブジェクトの座標系に変換
        //オブジェクトの座標系はcameraから見ているので、cameraを渡している
        var p_wld=p_NDC.unproject(camera);

        //レイの生成
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x_NDC,y_NDC), camera);

        //取得対象となる物体の配列を引数で渡す
        //triangleの配列を作ればよい？
        var intersects = raycaster.intersectObjects(scene.children);

        //交差していたらintersectsが1以上になるので、処理を書けばよい
        if( intersects.length >0 )
        {
            intersects[0].face.color.setRGB(1,0,0);
            intersects[0].object.geometry.colorsNeedUpdate=true;
        }
    
    
    }
    

}
