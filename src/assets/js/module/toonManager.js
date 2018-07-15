class ToonManager{
  constructor(i, objs){
    this.index = i;
    this.objs = objs;
    this.easings = this.objs.easings;

    this.speed = Math.random();
    this.duration = 2.5 + 0.8 * this.speed;

    this.aTranslate = this.objs.instanceG.attributes.aTranslate;
    this.aScale = this.objs.instanceG.attributes.aScale;
    this.aRotateY = this.objs.instanceG.attributes.aRotateY;


    this.dammy = {
      height: 0,
      scaleOffset: 0,
      rotateY: 0,
    }

    this.init();
  }

  init(){
    const yTween = new TweenMax.fromTo(
      this.dammy, 
      this.duration, 
      {
        height: 0
      },
      {
        height: 150 + 200 * this.speed,
        ease: this.easings.height,
        onUpdate: () => {
          this.aTranslate.needsUpdate = true;
          this.aTranslate.array[this.index * 3 + 1] = this.dammy.height;
          

        }
      }
    );

    const sTween = new TweenMax.fromTo(
      this.dammy,
      this.duration,
      {
        scaleOffset: 0,
      },
      {
        scaleOffset: 2.,
        ease: this.easings.scale,
        onUpdate: () => {
          this.aScale.needsUpdate = true;
          this.aScale.array[this.index * 3 + 0] = 1 - this.dammy.scaleOffset;
          this.aScale.array[this.index * 3 + 1] = 1 + this.dammy.scaleOffset;
          this.aScale.array[this.index * 3 + 2] = 1 - this.dammy.scaleOffset;

        }
      }

    );

    const rTween = new TweenMax.fromTo(
      this.dammy,
      this.duration,
      {
        rotateY: 0.25
      },
      {
        rotateY: 0.,
        ease: this.easings.rotate,
        onUpdate: () => {
          this.aRotateY.needsUpdate = true;
          this.aRotateY.array[this.index] = this.dammy.rotateY;
        }
      }
    );

    this.tween = new TimelineMax({
      delay: Math.random() * this.duration * 3,// 
      repeatDelay: 0.,
      repeat: -1
    });

    this.tween
    .add(yTween.play(), 0)
    .add(sTween.play(), 0)
    .add(rTween.play(), 0)

  }
}