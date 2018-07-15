class Webgl{
  constructor(){
    this.init();
  }


  init(){
    this.width = 1400;
    this.height = 1400;
    this.aspect = this.width / this.height;
    this.setProps();
    this.container = document.getElementById( "wrapper" );

    this.controls = new Controls(this);


    this.renderer = new THREE.WebGLRenderer( { 
      antialias: true,
      alpha: true
    } );

    
    this.renderer.setSize( ResizeWatch.width, ResizeWatch.height );

    this.renderer.setClearColor( this.controls.props.floorColor, 1.0 );
    this.container.appendChild( this.renderer.domElement );

    var ratio = (Useragnt.pc) ? 1.0 : 2.0;
    this.renderer.setPixelRatio(ratio);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
    var cameraZ = 1000;
    this.camera.position.set(400, 100, -800);
    this.camera.lookAt(this.scene.position);

    this.time = new THREE.Clock();

    var cameraControl =  new THREE.OrbitControls(this.camera, this.renderer.domElement); 
    cameraControl.enableZoom = false;


    this.loading = new Loading(this);
    this.render();

    ResizeWatch.register(this);
  };


  setProps(){
    var width = ResizeWatch.width;
    var height = ResizeWatch.height;
    var aspect = width / height;

    this.props = {
      width: width,
      height: height,
      aspect: aspect,
      fov: 45,
      left: -width / 2,
      right: width / 2,
      top: height / 2,
      bottom: -height / 2,
      near: 0.1,
      far: 1000000,
      parent: document.getElementById("wrapper")
    };
  };


  loadComp(){
    this.objs = new Objs(this);

    this.controls.init();
  }


  render(){
    var delta = this.time.getDelta() * 5.0;
    var time = this.time.elapsedTime;


    if(this.objs){
      this.objs.render(time, delta);
    }

    requestAnimationFrame(this.render.bind(this));
  };


  resizeUpdate(){
    this.setProps();
    this.renderer.setSize(this.props.width, this.props.height);

    this.camera.aspect = this.props.aspect;

    this.camera.updateProjectionMatrix();

    if(ResizeWatch.aspect > this.aspect){
      var scale = ResizeWatch.width / this.width;
    } else {
      var scale = ResizeWatch.height / this.height;
    }
  }

}