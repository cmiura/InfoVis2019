var volume2 = new KVS.LobsterData();
var screen2 = new KVS.THREEScreen();

screen2.init( volume2, {
    width: window.innerWidth*0.3,
    height: window.innerHeight*0.3,
    enableAutoResize: false
});

var raycaster_mesh

function BoundingBoxGeometry( volume2 )
{
    var minx = volume2.min_coord.x;
    var miny = volume2.min_coord.y;
    var minz = volume2.min_coord.z;

    var maxx = volume2.max_coord.x;
    var maxy = volume2.max_coord.y;
    var maxz = volume2.max_coord.z;

    var vertices = [
        [ minx, miny, minz ], // 0
        [ maxx, miny, minz ], // 1
        [ maxx, miny, maxz ], // 2
        [ minx, miny, maxz ], // 3
        [ minx, maxy, minz ], // 4
        [ maxx, maxy, minz ], // 5
        [ maxx, maxy, maxz ], // 6
        [ minx, maxy, maxz ] // 7
    ];

    var faces = [
        [ 0, 1, 2 ], // f0
        [ 0, 2, 3 ], // f1
        [ 7, 6, 5 ], // f2
        [ 7, 5, 4 ], // f3
        [ 0, 4, 1 ], // f4
        [ 1, 4, 5 ], // f5
        [ 1, 5, 6 ], // f6
        [ 1, 6, 2 ], // f7
        [ 2, 6, 3 ], // f8
        [ 3, 6, 7 ], // f9
        [ 0, 3, 7 ], // f10
        [ 0, 7, 4 ], // f11
    ];

    var geometry = new THREE.Geometry();

    var nvertices = vertices.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var vertex = new THREE.Vector3().fromArray( vertices[i] );
        geometry.vertices.push( vertex );
    }

    var nfaces = faces.length;
    for ( var i = 0; i < nfaces; i++ )
    {
        var id = faces[i];
        var face = new THREE.Face3( id[0], id[1], id[2] );
        geometry.faces.push( face );
    }

    geometry.doubleSided = true;

    return geometry;
}

function VolumeTexture( volume2 )
{
    var width = volume2.resolution.x * volume2.resolution.z;
    var height = volume2.resolution.y;
    var data = new Uint8Array( width * height );
    for ( var z = 0, index = 0; z < volume2.resolution.z; z++ )
    {
        for ( var y = 0; y < volume2.resolution.y; y++ )
        {
            for ( var x = 0; x < volume2.resolution.x; x++, index++ )
            {
                var u = volume2.resolution.x * z + x;
                var v = y;
                data[ width * v + u ] = volume2.values[index][0];
            }
        }
    }

    var format = THREE.AlphaFormat;
    var type = THREE.UnsignedByteType;

    var texture = new THREE.DataTexture( data, width, height, format, type );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function TransferFunctionTexture(reso)
{
    var resolution = reso;
    var width = resolution;
    var height = 1;
    var data = new Float32Array( width * height * 4 );
    for ( var i = 0; i < resolution; i++ )
    {
        var color = KVS.RainbowColorMap( 0, 255, i );
        var alpha = i / 255.0;
        data[ 4 * i + 0 ] = color.x;
        data[ 4 * i + 1 ] = color.y;
        data[ 4 * i + 2 ] = color.z;
        data[ 4 * i + 3 ] = alpha;
    }

    var format = THREE.RGBAFormat;
    var type = THREE.FloatType;

    var texture = new THREE.DataTexture( data, width, height, format, type );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function makeZarigani2(reso)
{
   

//    screen.dynamicDampingFactor = 0.3;
//    screen.trackball.rotatetSpeed = 1.0;
//    screen.trackball.noPan = false;
//    screen.trackball.noZoom = false;
//    screen.renderer.setClearColor( new THREE.Color( "black" ) );

    var exit_buffer = new THREE.Scene();
    var exit_texture = new THREE.WebGLRenderTarget(
        screen2.width, screen2.height,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            format: THREE.RGBFormat,
            type: THREE.FloatType,
            generateMipmaps: false
        }
    );

    var bounding_geometry = BoundingBoxGeometry( volume2 );
    var volume_texture = VolumeTexture( volume2 );
    //resoでapplyのvalueを受け取るようにしたいんです
    //消してから更新しないと同じ失敗ですよ
    var transfer_function_texture = TransferFunctionTexture(reso);

    var bounding_material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'bounding.vert' ).textContent,
        fragmentShader: document.getElementById( 'bounding.frag' ).textContent,
        side: THREE.BackSide
    });

    var bounding_mesh = new THREE.Mesh( bounding_geometry, bounding_material );
    exit_buffer.add( bounding_mesh );

    var raycaster_material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'raycaster.vert' ).textContent,
        fragmentShader: document.getElementById( 'raycaster.frag' ).textContent,
        side: THREE.FrontSide,
        uniforms: {
            volume_resolution: { type: "v3", value: volume2.resolution },
            exit_points: { type: "t", value: exit_texture },
            volume_data: { type: "t", value: volume_texture },
            transfer_function_data: { type: "t", value: transfer_function_texture },
            light_position: { type: 'v3', value: screen2.light.position },
            camera_position: { type: 'v3', value: screen2.camera.position },
            background_color: { type: 'v3', value: new THREE.Vector3().fromArray( screen2.renderer.getClearColor().toArray() ) },
        }
    });

    var raycaster_mesh = new THREE.Mesh( bounding_geometry, raycaster_material );
    screen2.scene.add( raycaster_mesh );

    document.addEventListener( 'mousemove', function() {
        screen2.light.position.copy( screen2.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen2.resize( [ window.innerWidth*0.3, window.innerHeight*0.3 ] );
    });

    screen2.loop();

    screen2.draw = function()
    {
        if ( screen2.renderer == undefined ) return;
        screen2.scene.updateMatrixWorld();
        screen2.trackball.handleResize();
        screen2.renderer.render( exit_buffer, screen2.camera, exit_texture, true );
        screen2.renderer.render( screen2.scene, screen2.camera );
        screen2.trackball.update();
    }
}

function OnButtonClick2(){
    screen2.scene.remove(raycaster_mesh);
    var reso = parseInt(document.getElementById("resolution").value);
    console.log(reso);
    makeZarigani2(reso);
 }  