

//buttoから取得はできるが，どうやってmainに反映させる？？
//最初から，id=isovalueのvalueをとるようにしたら，there is no texture で描写が間に合っていないとか？

var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();

screen.init( volume, {
    width: window.innerWidth*0.3,
    height: window.innerHeight*0.3,
    enableAutoResize: false
});

var surfaces

function makeZarigani(value)
{
    //var volume = new KVS.LobsterData();
    //var screen = new KVS.THREEScreen();
    
    /*screen.init( volume, {
        width: window.innerWidth*0.3,
        height: window.innerHeight*0.3,
        enableAutoResize: false
    }); */
    
    var bounds = Bounds( volume );
    screen.scene.add( bounds );
    
    var isovalue = value;
    surfaces = Isosurfaces( volume, isovalue );
    screen.scene.add( surfaces );
    
    
    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth*0.3, window.innerHeight*0.3 ] );
    });
    
    screen.loop();

    
}

function OnButtonClick(){
    screen.scene.remove(surfaces);
    var value = parseInt(document.getElementById("isovalue").value);
    console.log(value);
    makeZarigani(value);
 }  

//更新の前に削除しなければならないっぽい
//sceneを