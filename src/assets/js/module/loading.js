class Loading{
  constructor(webgl){
    this.webgl = webgl;
    // this.isIE11 = (Useragnt.userAgent.indexOf('trident') != -1) ? true : false; //useragntで調べる
    // console.log(this.isIE11, "ie11");

    this.images = [
    ];


    this.texts = [
    ];

    this.audios = [
    ];

    this.jsons = [
    ];

    this.vertShader = [
      /* 00 */ "assets/glsl/output_box.vert",
      /* 01 */ "assets/glsl/output_floor.vert",

    ];

    this.fragShader = [
      /* 00 */ "assets/glsl/output_box.frag",
      /* 02 */ "assets/glsl/output_floor.frag",
      /* 01 */ "assets/glsl/shadow.frag",
    ];

    this.videos = [
    ];

    this.loadingCount = 0;
    this.wholeLoadingNum = this.texts.length + this.audios.length + this.images.length + this.vertShader.length + this.fragShader.length + this.videos.length + this.jsons.length;

    if(this.images.length > 0){
      this.initImage();
    }

    if(this.audios.length > 0){
      this.initAudio();
    }

    if(this.vertShader.length > 0){
      this.initShader();
    }

    if(this.videos.length > 0){
      this.initVideo();
    }

    if(this.jsons.length > 0){
      this.initJson();
    }

    if(this.texts.length > 0){
      this.initTextTexture();
    }
   }

   initTextTexture(){
    this.textsLength = this.texts.length;
    this.textsCount = 0;
    this.isTextComplete = false;

    for(var i = 0; i < this.textsLength; i++){
      this.createTextTexture(i);
    }
   }

   createTextTexture(i){
    var _texture = new THREE.TextureLoader().load(this.texts[i].src, function(texture){
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // console.log("loading img", texture);

      texture.needsUpdate = true;
      this.textsCount++;
      this.loadingCount++;

      var ratio = 0.5;

      this.texts[i] = {
        texture: _texture,
        width: _texture.image.width * ratio,
        height: _texture.image.height * ratio,
        top: this.texts[i].top * ratio,
        isMask: this.texts[i].mask
      };


      if(this.textsCount === this.textsLength) {
        this.isTextComplete = true;
        console.log("comp img");

        this.completeLoadingAll();
      }
      
    }.bind(this));
   }






   initJson(){
    this.jsonsLength = this.jsons.length;
    // this.jsonsCount = 0;
    this.isJsonComplete = false;

    for(var i = 0 ; i < this.jsonsLength; i++){
      this.importJson(i);
    }
   }

   importJson(i){

    var _this = this;

    $.ajax({
        type: 'GET', 
        url: this.jsons[i], 
        dataType: 'json',
        cache: false,
        success: (data) => {
          var data = data;


          _this.jsons[i] = data;

          _this.loadingCount++;


          // _this.isImageComplete = true;
          // console.log("comp img");

          _this.completeLoadingAll();
        }
    });
   }


   initImage(){

    this.imagesLength = this.images.length;
    this.imagesCount = 0;
    this.isImageComplete = false;

    for(var i = 0; i < this.imagesLength; i++){
      this.createTexture(i);

    }
   }

   createTexture(i){


    var _texture = new THREE.TextureLoader().load(this.images[i], function(texture){
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // console.log("loading img", texture);

      texture.needsUpdate = true;
      this.imagesCount++;
      this.loadingCount++;

      var ratio = 0.8;

      this.images[i] = _texture;
      // console.log("img");


      if(this.imagesCount === this.imagesLength) {
        this.isImageComplete = true;
        console.log("comp img");

        this.completeLoadingAll();
      }
      
    }.bind(this));
  }

  initAudio(){
    this.audiosLength = this.audios.length;
    this.audiosCount = 0;

    for(let i = 0; i < this.audios.length; i++){
      this.audios[i] = this.importAudio(i);
    }
  }

  importAudio(i){
    const request = new XMLHttpRequest();
  
    request.open('GET', this.audios[i], true);
    request.responseType = 'arraybuffer';

    const _this = this;

    request.onload = function() {
      // _this.audioContext.decodeAudioData(request.response, function(buffer){
        _this.audios[i] = request.response;
        _this.audiosCount++;
        _this.loadingCount++;
        if(_this.audiosLength === _this.audiosCount){
          _this.isAudioComplete = true;
          console.log("comp audio");

          _this.completeLoadingAll();
        }
      // });
    }

    request.send();

  }

  initShader(){
    
    

    this.shaderLength = this.vertShader.length + this.fragShader.length;
    this.shaderCount = 0;

    this.isShaderComplete = false;


    for(var i = 0; i < this.vertShader.length; i++){
      this.importShader_vert(i);
    }


    for(var i = 0; i < this.fragShader.length; i++){
      this.importShader_frag(i);
    }
  };

  initVideo(){
    
    // for ie11, use canvas instead of video
    this.canvases = [];

    this.masks = [];

    this.videoLength = this.videos.length;
    this.videoCount = 0;
    this.isVideoComplete = false;


    for(var i = 0; i < this.videoLength; i++){
      var video = this.createVideo(this.videos[i], i);
      this.videos[i] = video; // video url -> video element

      this.videos[i + this.videoLength] = video; // video url -> video element


      video.isFirstCanplaythrough = false;
      video.oncanplaythrough = function(_i, _video){
        if(_video.isFirstCanplaythrough) return;
        _video.isFirstCanplaythrough = true;
        _video.width = _video.videoWidth;
        _video.height = _video.videoHeight;

        // if(Useragnt.ios) _video.tween = this.maskTween(_video);

        // if(this.isIE11){
        //  var _canvas = this.createCanvas(_video);
        //  this.masks[_i] = this.setCanvasTexture(_canvas);
        // } else {
          this.masks[_i] = this.setVideoTexture(_video);
        // }
        

        this.videoCount++;
        this.loadingCount++;
        if(this.videoCount === this.videoLength) {
          this.isVideoComplete = true;
          console.log("comp video");

          this.completeLoadingAll();
        }

      }.bind(this, i, video);
    }

  }


  createVideo(src, i){
    var video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");

    // video.preload = "auto";
    video.autoplay = false;
    video.loop = false;
    video.src = src;
    // video.playsinline = true;
    video.load();
    video.num = i; // 
    video.isPlaying = false;
    // console.log(video);
    // videoWrapper.appendChild(video)

    video.onended = function(i){
      console.log("videoEnd", video.isPlaying, video.currentTime);
      if(!video.isPlaying) return;

      video.currentTime = 0;
      

      video.isPlaying = false;
      // video.isEnd.value = 1;

      if(Useragnt.ie) {
        video.pause();
      }

      console.log(Useragnt);
      if(!Useragnt.safari || Useragnt.ios){
        this.webgl.endVideo();
      }
      

    }.bind(this, i);

    video.onpause = function(){
      console.log("pause");
      // if(!video.isPlaying) return;

      if(Useragnt.safari && !Useragnt.ios) {
        if(video.currentTime === video.duration){
          video.isPlaying = false;
          video.currentTime = 0;

          this.webgl.endVideo();
          video.pause();
        }
      }

      if(video.isPlaying && video.currentTime !== video.duration) {
        video.play();
      }
    }.bind(this)

    video.onplaying = function(){
      console.log("playing");
    }

    video.onplay = function(){
      console.log("videoPlay", video.isPlaying);

      if(Useragnt.firefox) video.currentTime = 0;

      video.isPlaying = true;
    }.bind(this);

    return video;
  }


  createCanvas(_video){
    var canvas = document.createElement("canvas");
    canvas.width = _video.width;
    canvas.height = _video.height;
    var context = canvas.getContext("2d");

    var c = {
      canvas: canvas,
      context: context,
      video: _video
    }

    this.canvases.push(c);

    return c;
  }



  setCanvasTexture(_mat){
    var canvas = _mat.canvas;
    var texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    _mat.texture = texture;

    return texture;
  };


  setVideoTexture(_mat){
    var texture = new THREE.VideoTexture(_mat);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    return texture;
  };


  rendering_canvas(){
    if(!this.isIE11) return;

    for(var i = 0, len = this.canvases.length; i < len; i++){
      var ctx = this.canvases[i].context;
      var can = this.canvases[i].canvas;
      var video = this.canvases[i].video;
      var tex =  this.canvases[i].texture;
      if(video.isPlaying){
        tex.needsUpdate = true;
        // ctx.clearRect(0, 0, can.width, can.height);
        ctx.drawImage(video, 0, 0);
      } else {
        ctx.clearRect(0, 0, can.width, can.height);
      }
    }
  };



  importShader_vert(i){

    var myRequest = new XMLHttpRequest();

    var _this = this;
    myRequest.onreadystatechange = function() {
      if ( myRequest.readyState === 4 ) {
         _this.vertShader[i] = myRequest.response;
        _this.completeShaderLoad();
      }
    };


    myRequest.open("GET", this.vertShader[i], true);
    myRequest.send();
  };


  importShader_frag(i){

    var myRequest = new XMLHttpRequest();

    var _this = this;
    myRequest.onreadystatechange = function() {
      if ( myRequest.readyState === 4 ) {
         _this.fragShader[i] = myRequest.response;


        _this.completeShaderLoad();
      }
    };

    myRequest.open("GET", this.fragShader[i], true);
    myRequest.send();
  };



  completeShaderLoad(){
    this.shaderCount++;
    this.loadingCount++;


    if(this.shaderCount === this.shaderLength) {
      this.isShaderComplete = true;
      console.log("comp shader");
      this.completeLoadingAll();
    }
  };

  completeLoadingAll(){
    console.log(this.loadingCount, this.wholeLoadingNum);
    // this.webgl.textDom.updateLoadingBar(this.loadingCount / this.wholeLoadingNum);
    if(this.loadingCount !== this.wholeLoadingNum) return;

    console.log("loading --- comp");

    this.webgl.vertShader = this.vertShader;
    this.webgl.fragShader = this.fragShader;
    this.webgl.videos = this.videos;
    this.webgl.canvases = this.canvases;
    this.webgl.masks = this.masks;
    this.webgl.images = this.images;
    this.webgl.audios = this.audios;
    this.webgl.jsons = this.jsons;
    this.webgl.texts = this.texts;

    this.webgl.loadComp();
    
  };

 }