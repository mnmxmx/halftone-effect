class Objs{
  constructor(webgl){
    this.webgl = webgl;
    this.controls = this.webgl.controls;
    this.objSize = {
      x: 30,
      y: 30,
      z: 30
    };


    this.density = 60;
    this.column = 16;
    this.objNum = this.column * this.column;
    this.range = 180;

    this.transOffset = {
      x: - (this.column - 1) / 2 * (this.density + this.objSize.x),
      y: 0,
      z: - (this.column - 1) / 2 * (this.density + this.objSize.z)
    }

    this.setLight();

    this.colorPallete = [];
    this.toneColorPallete = [];


    const _colorPallete = this.controls.props.colorPallete;
    const _toneColorPallete = this.controls.props.toneColorPallete;



    for(let i = 0; i < _colorPallete.length; i++){
      this.colorPallete[i] = new THREE.Color(_colorPallete[i]);
      this.toneColorPallete[i] = new THREE.Color(_toneColorPallete[i]);
    }


    const easePath_height = 
    // 'M0,0,C0,0,0.266,0,0.266,0,0.368,0.028,0.348,1,0.588,1,0.82,1,0.796,0,0.86,0,0.86,0,0.991,0,1,0'
    'M0,0,C0,0,0.3,0,0.3,0,0.402,0.028,0.382,1,0.656,1,0.918,1,1,0.122,1,0'

    const easePath_scale = 
    // 'M0,0,C0.056,-0.05,0.062,-0.258,0.168,-0.258,0.33,-0.258,0.35,0.146,0.482,0.146,0.6,0.146,0.596,-0.052,0.672,-0.052,0.726,-0.052,0.712,-0.01,0.762,-0.01,0.818,-0.01,0.829,-0.194,0.882,-0.194,0.915,-0.194,0.952,0,1,0'
    'M0,0,C0.056,-0.05,0.062,-0.258,0.168,-0.258,0.33,-0.258,0.35,0.146,0.482,0.146,0.6,0.146,0.84,0,1,0'

    const easePath_rotate = 
    'M0,0 C0.085,0 0.344,0 0.344,0 0.402,0.538 0.602,1 0.926,1 0.926,1 1,1 1,1';

    this.easings = {
      height: CustomEase.create('height', easePath_height),
      scale: CustomEase.create('scale', easePath_scale),
      rotate: CustomEase.create('rotate', easePath_rotate)
    }

    this.tweenMngArray = [];

    this.init();
  }


  init(){
    this.uniforms = {
      uTick: {type: 'f', value: 0},
      uTileSize: {type: 'v3', value: new THREE.Vector3(this.objSize.x, this.objSize.y, this.objSize.z)},
      uDirLightPos: {type: 'v3', value: this.light.position},

      uRange: {type: 'f', value: this.range},

      uEyePosition: {type: 'v3', value: this.webgl.camera.position},
      uFogNear: {type: 'f', value: 0.1},
      uFogFar: {type: 'f', value: 2000},
      uFogStart: {type: 'f', value: 0.1},
      uFogEnd: {type: 'f', value: 1.0},
      uFogColor: {type: 'v3', value: new THREE.Color(this.controls.props.floorColor)},

      uDotScale: {type: 'f', value: this.controls.props.dotScale},
      uLineScale: {type: 'f', value: this.controls.props.lineScale},

      uColorArray: {type: 'v3v', value: this.colorPallete},
      uToneColorArray: {type: 'v3v', value: this.toneColorPallete},

      uTonePattern:{type: 'i', value: 1},

      uFloorToneColor: {type: 'v3', value: new THREE.Color(this.controls.props.floorToneColor)},

      uOffsetHeight: {type: 'f', value: -100},



      shadowMap: { type: 't', value: this.light.shadow.map.texture },
      shadowMapSize: {type: 'v2', value: this.light.shadow.mapSize},
      shadowP: { type: 'm4', value: this.shadowCamera.projectionMatrix},
      shadowV: { type: 'm4', value: this.shadowCamera.matrixWorldInverse},


    }

     this.createObj(); 
     this.createFloor();
     this.createTween();
  }

  createTween(){
    for(let i = 0; i < this.objNum; i++){
      this.tweenMngArray[i] = new ToonManager(i, this);
    }
  }

  createObj(){
    console.log('init --- objs');

    this.originalG = 
    new THREE.BoxBufferGeometry(this.objSize.x, this.objSize.y, this.objSize.z);

    this.instanceG = new THREE.InstancedBufferGeometry();

    // 頂点
    var vertices = this.originalG.attributes.position.clone();
    this.instanceG.addAttribute('position', vertices);

    var normals = this.originalG.attributes.normal.clone();
    this.instanceG.addAttribute("normal", normals);

    // uv
    var uvs = this.originalG.attributes.uv.clone();
    this.instanceG.addAttribute('uv', uvs);

    // index
    if(this.originalG.index){
      var indices = this.originalG.index.clone();
      this.instanceG.setIndex(indices);
    }
    

    var nums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 1), 1, 1);
    var randoms = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 1), 1, 1);
    var colorNums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 1), 1, 1);
    var colors = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);
    var dotColors = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);

    var defTranslates = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);
    var translates = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);
    var scales = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, 1);
    var rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 1), 1, 1);



    for(let i = 0; i < this.objNum; i++){
      nums.setX(i, i);

      randoms.setX(i, Math.random());

      colorNums.setX(i, Math.floor(this.colorPallete.length * Math.random()));

      scales.setXYZ(i, 1, 1, 1);

      const defX = (i % this.column) * (this.objSize.x + this.density);
      const defZ = Math.floor(i / this.column) * (this.objSize.z + this.density);

      defTranslates.setXYZ(i, defX + this.transOffset.x, 0, defZ + this.transOffset.z);

    }

    this.instanceG.addAttribute('aNum', nums);
    this.instanceG.addAttribute('aRandom', randoms);

    this.instanceG.addAttribute('aColorNum', colorNums);

    this.instanceG.addAttribute('aDefTranslate', defTranslates);
    this.instanceG.addAttribute('aTranslate', translates);
    this.instanceG.addAttribute('aScale', scales);
    this.instanceG.addAttribute('aRotateY', rotates);

    this.material_boxes = new THREE.ShaderMaterial({
      vertexShader: this.webgl.vertShader[0],
      fragmentShader: this.webgl.fragShader[0],
      uniforms: this.uniforms,
      side: THREE.FrontSide,
    });


    this.shadowMaterial_boxes = new THREE.ShaderMaterial({
      vertexShader: this.webgl.vertShader[0],
      fragmentShader: this.webgl.fragShader[2],
      uniforms: this.uniforms,
      side: THREE.BackSide,
    });

    this.boxes = new THREE.Mesh(this.instanceG, this.material_boxes);
    this.webgl.scene.add(this.boxes);

  }


  createFloor(){
    const g = new THREE.BoxBufferGeometry(2000, 1, 2000);
    this.material_floor = new THREE.ShaderMaterial({
      vertexShader: this.webgl.vertShader[1],
      fragmentShader: this.webgl.fragShader[1],
      uniforms: this.uniforms,
      side: THREE.FrontSide,
    });

    this.shadowMaterial_floor = new THREE.ShaderMaterial({
      vertexShader: this.webgl.vertShader[1],
      fragmentShader: this.webgl.fragShader[2],
      uniforms: this.uniforms,
      side: THREE.BackSide,
    });

    this.floor = new THREE.Mesh(g, this.material_floor);
    this.webgl.scene.add(this.floor);
  }


  setLight(){
    this.light = new THREE.DirectionalLight( 0xffffff );
    this.light.position.set( this.range * 4.0, this.range * 2.0, this.range * 1.6 );
    this.light.castShadow = true;

    const width = this.range * 12.0;
    this.light.shadow = new THREE.LightShadow( new THREE.OrthographicCamera( width / - 2, width / 2, width / 2, width / - 2, 1, width ) );
    
    this.shadowCamera = this.light.shadow.camera;
    this.shadowCamera.position.copy(this.light.position);
    this.shadowCamera.lookAt(this.webgl.scene.position);


    if(this.light.shadow.map === null){
      this.light.shadow.mapSize.x = 2048;
      this.light.shadow.mapSize.y = 2048;

      var pars = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

      this.light.shadow.map = new THREE.WebGLRenderTarget( this.light.shadow.mapSize.x, this.light.shadow.mapSize.y, pars );
    }

    // this.webgl.scene.add( new THREE.CameraHelper( this.shadowCamera ) );
    // this.initShadowMapViewers();
  }

  initShadowMapViewers(){
    this.dirLightShadowMapViewer = new THREE.ShadowMapViewer( this.light );
    this.dirLightShadowMapViewer.position.x = 10;
    this.dirLightShadowMapViewer.position.y = 10;
    this.dirLightShadowMapViewer.size.width = 256;
    this.dirLightShadowMapViewer.size.height = 256;
    this.dirLightShadowMapViewer.update(); //Required when setting position or size directly
  }


  render(time, delta){
    this.uniforms.uEyePosition.value = this.webgl.camera.position;

    this.uniforms.uTick.value = time;

    this.boxes.material = this.shadowMaterial_boxes;
    
    this.webgl.renderer.render( this.webgl.scene, this.shadowCamera, this.light.shadow.map);

    this.boxes.material = this.material_boxes;
    this.floor.material = this.material_floor;

    this.webgl.renderer.render( this.webgl.scene, this.webgl.camera );

    if(this.dirLightShadowMapViewer){
      this.dirLightShadowMapViewer.render( this.webgl.renderer );

    }

  }
}