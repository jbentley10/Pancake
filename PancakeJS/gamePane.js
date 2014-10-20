var Barrier = function(position) {
  //// A Barrier is a game object
  // Default position if unspecified is at origin
  position = position || {x: 0, y: 0, z: 0};
  this.type = 'barrier';
  this.geometry = new THREE.CubeGeometry(90, 90, 90);
  // Geometry should always be around origin
  this.material = new THREE.MeshLambertMaterial({color: 0xff0000});
  this.object = new THREE.Mesh(this.geometry, this.material);
  // A mesh is an Object3D, change its position to move
  this.object.position = position;
};

var Robot = function(position) {
  //// A Robot is a game object
  // Default position if unspecified is at origin
  position = position || {x: 0, y: 0, z: 0};
  this.type = 'robot';
  this.geometry = new THREE.SphereGeometry(45, 20, 20);
  // Geometry should always be around origin
  // Make it blue
  this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
  this.object = new THREE.Mesh(this.geometry, this.material);
  // A mesh is an Object3D, change its position to move
  this.object.position = position;
};

var Game = function() {
  // A Game object is the highest level object representing entire game
};

Game.prototype.init = function() {
  var that = this;
  this.objects = [];
  this.objects.push(new Barrier({x: 0, y: 100, z: 0}));
  this.objects.push(new Barrier({x: 100, y: 0, z: 0}));
  this.objects.push(new Barrier({x: 100, y: 100, z: 0}));
  this.objects.push(new Robot({x: 0, y: 0, z: 0}));
  
  this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
  this.camera.position.z = 500;

  this.scene = new THREE.Scene();
  // Add all game objects to scene
  _.each(this.objects, function(element, index) {
    that.scene.add(element.object);
  });

  // Spotlight
  var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
  spotlight.position.set(0, -100, 300);
  this.scene.add(spotlight);
  // Ambient light
  var ambient_light = new THREE.AmbientLight(0x202020);
  this.scene.add(ambient_light);
  // Background plane
  var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800),
    new THREE.MeshLambertMaterial());
  bgplane.translateZ(-100);
  this.scene.add(bgplane);
  
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.renderer.setSize(800, 600);
  this.renderer.setClearColor(0xeeeeee, 1.0);
  document.body.appendChild(this.renderer.domElement);
};

Game.prototype.render = function(t) {
  // Bob the camera a bit
  this.camera.position.x = Math.sin(t / 1000.0) * 60;
  this.camera.position.y = -500 + Math.sin(t / 700.0) * 40;
  this.camera.lookAt(this.scene.position);
  this.renderer.render(this.scene, this.camera);
};

Game.prototype.start = function() {
  var that = this;
  var time0 = new Date().getTime(); // milliseconds since 1970
  var loop = function() {
    var time = new Date().getTime();
    that.render(time - time0);
    requestAnimationFrame(loop, that.renderer.domElement);
  };
  loop();  
};