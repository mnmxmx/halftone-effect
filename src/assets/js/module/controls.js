class Controls{
  constructor(webgl){
    this.webgl = webgl;

    this.props = {
      tone: 'dot',
      dotScale: 0.6,
      lineScale: 0.6,
      floorColor: 0x57ebff,
      floorToneColor: 0x0019d7,

      colorPallete: [
        0xff2a5c,
        0xffe100,
      ],

      toneColorPallete: [
        0xc300ff,
        0x00ddd6,
      ],

      isMotionStop: false,

    };
  }

  init(){
    this.objs = this.webgl.objs;
    this.gui = new dat.GUI({width: 300});


    this.gui.add(this.props, 'tone', ['dot', 'line']).name('tone pattern').onChange(this.changePattern.bind(this));
    this.gui.add(this.props, 'dotScale', 0.3, 1.0).name('dot scale').onChange(this.changeDotScale.bind(this));
    this.gui.add(this.props, 'lineScale', 0.3, 1.0).name('line scale').onChange(this.changeLineScale.bind(this));

    this.gui.add(this.props, 'isMotionStop').onChange(this.switchMotion.bind(this));


    this.obj1Folder = this.gui.addFolder('obj1');
    this.obj1Folder.open();
    this.obj1Folder.addColor(this.props.colorPallete, 0).name('obj1 color').onChange(this.changeColor1.bind(this));
    this.obj1Folder.addColor(this.props.toneColorPallete, 0).name('obj1 toneColor').onChange(this.changeToneColor1.bind(this));

    this.obj2Folder = this.gui.addFolder('obj2');
    this.obj2Folder.open();
    this.obj2Folder.addColor(this.props.colorPallete, 1).name('obj2 color').onChange(this.changeColor2.bind(this));
    this.obj2Folder.addColor(this.props.toneColorPallete, 1).name('obj2 toneColor').onChange(this.changeToneColor2.bind(this));

    this.floorFolder = this.gui.addFolder('floor');
    this.floorFolder.open();
    this.floorFolder.addColor(this.props, 'floorColor').name('floor color').onChange(this.changeFloorColor.bind(this));
    this.floorFolder.addColor(this.props, 'floorToneColor').name('floor toneColor').onChange(this.changeFloorToneColor.bind(this));
  }

  changePattern(value){
    if(value === 'dot'){
      this.objs.uniforms.uTonePattern.value = 1;
    } else if(value ==='line'){
      this.objs.uniforms.uTonePattern.value = 2;
    }
  }

  changeDotScale(value){
    this.objs.uniforms.uDotScale.value = value;
  }

  changeLineScale(value){
    this.objs.uniforms.uLineScale.value = value;
  }

  switchMotion(value){

    for(let i = 0; i < this.objs.objNum; i++){
      const tweenMng = this.objs.tweenMngArray[i];
      if(value){
        tweenMng.tween.pause();
      } else {
        tweenMng.tween.play();
      }

    }

  }

  changeFloorColor(value){
    var color = new THREE.Color(value);
    this.webgl.renderer.setClearColor( color, 1.0 );
    this.objs.uniforms.uFogColor.value = color;
  }

  changeFloorToneColor(value){
    var color = new THREE.Color(value);
    this.objs.uniforms.uFloorToneColor.value = color;

  }

  changeColor1(value){
    var color = new THREE.Color(value);
    this.objs.uniforms.uColorArray.value[0] = color;
  }

  changeToneColor1(value){
    var color = new THREE.Color(value);
    this.objs.uniforms.uToneColorArray.value[0] = color;
  }

  changeColor2(value){
    var color = new THREE.Color(value);
    this.objs.uniforms.uColorArray.value[1] = color;
  }

  changeToneColor2(value){
    var color = new THREE.Color(value);
    this.objs.uniforms.uToneColorArray.value[1] = color;
  }


}