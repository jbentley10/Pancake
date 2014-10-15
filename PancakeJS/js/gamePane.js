var loadFile = function(url) {
    var result = null;
    $.ajax({
           url: url,
           async: false
           }).done(function(data) {
                   result = data;
                   });
    return result;
};

var gamePane = function(game) {
    // Initialize variables
    this.scene = new THREE.Scene();
    this.game = game;
    
    var that = this;

    var axes = new THREE.AxisHelper(100);
    this.scene.add( axes );
    // setTime(60);
    
    // Set up Skybox
    var directions  = ["space", "space", "space", "space", "space", "space"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );   
    
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(directions[i] + imageSuffix),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial );
    this.scene.add( skyBox );  


    
    this.camera = new THREE.PerspectiveCamera(75, 4.0 / 3.0, 1, 10000);
    this.camera.position.z = 1000;
    
    
 
    this.material = new THREE.MeshLambertMaterial({
                                                  color : 0xff0000
                                                  });
    this.figure = null;
    
    // Spotlight
    var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
    spotlight.position.set(0, -100, 400);
    this.scene.add(spotlight);
    
    // Ambient light
    var ambient_light = new THREE.AmbientLight(0x202020);
    this.scene.add(ambient_light);

    // Board plane
    var perlinText = loadFile('shaders/perlin.glsl');
    var vertexShaderText = loadFile('shaders/woodVert.glsl');
    var fragmentShaderText = loadFile('shaders/woodFrag.glsl');

   
    this.bgMaterial = new THREE.ShaderMaterial({
    	uniforms: {
    		'uTime': { type: 'f', value: 0.0},
    	},
    	vertexShader: perlinText + vertexShaderText,
    	fragmentShader: perlinText + fragmentShaderText });
     
    this.bgplane = new THREE.Mesh(new THREE.CubeGeometry(1200, 1100, 75), this.bgMaterial);
    this.bgplane.rotation.x = 0;
    this.bgplane.translateZ(-100);
    this.scene.add(this.bgplane);
}