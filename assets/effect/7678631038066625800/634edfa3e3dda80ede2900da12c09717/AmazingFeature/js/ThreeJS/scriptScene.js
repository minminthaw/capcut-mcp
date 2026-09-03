const TWEEN=require("./tween");const customEasings=require("./customEasings").customEasings;const THREE=require("./three-amg-wrapper").THREE;const{ShaderPass}=require("./ShaderPass.js");class ScriptScene{constructor(amgScene=null,container=null){if(amgScene){this.scene=new THREE.Scene;this.scene._amgScene=amgScene}else{this.scene=new THREE.Scene}this.effect_type="transition";this.camera=null;this.renderer=null;this.scene.background=new THREE.Color(3355443);this.isAnimating=false;this.animationFrameId=null;this.sceneObjects=null;this.texture1=null;this.texture2=null;this.composer=null;this.renderPass=null;this.usePostProcessing=true;this.initCoreObjects();if(container){this.init(container)}}destroy(){this.isAnimating=false;if(this.animationFrameId!==null&&typeof cancelAnimationFrame!=="undefined"){cancelAnimationFrame(this.animationFrameId);this.animationFrameId=null}if(this.renderer){this.renderer.setAnimationLoop(null);this.renderer.dispose();if(this.renderer.domElement&&this.renderer.domElement.parentNode){this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)}}if(this.texture1){if(typeof this.texture1.dispose==="function")this.texture1.dispose();this.texture1=null}if(this.texture2){if(typeof this.texture2.dispose==="function")this.texture2.dispose();this.texture2=null}if(this.scene){this.scene.dispose()}if(typeof window!=="undefined"){window.removeEventListener("resize",this.handleResize)}if(this.sceneObjects&&this.sceneObjects.tweens){this.sceneObjects.tweens.forEach(tween=>{if(tween&&typeof tween.stop==="function"){tween.stop()}});this.sceneObjects.tweens=[]}if(this.shaderPasses&&this.shaderPasses.length){this.shaderPasses.forEach(pass=>{if(pass&&typeof pass.dispose==="function"){try{pass.dispose()}catch(e){}}});this.shaderPasses=[]}if(this.shaderPass&&typeof this.shaderPass.dispose==="function"){try{this.shaderPass.dispose()}catch(e){}}this.shaderPass=null;if(this.composer){this.composer.dispose();this.composer=null}this.renderPass=null;this.scene=null;this.camera=null;this.renderer=null;this.sceneObjects=null}initCoreObjects(){if(typeof window!=="undefined"){if(!window.innerWidth||!window.innerHeight){window.innerWidth=600;window.innerHeight=600}window.devicePixelRatio=window.devicePixelRatio||1;if(this.scene&&this.scene._amgScene&&this.scene._amgScene.assetMgr){const inputTexture=this.scene._amgScene.assetMgr.SyncLoad("share://input.texture");if(inputTexture&&inputTexture.width>0&&inputTexture.height>0){window.innerWidth=inputTexture.width;window.innerHeight=inputTexture.height}}}this.camera=new THREE.PerspectiveCamera(53.1,window.innerWidth/window.innerHeight,.1,1e4);this.camera.position.z=10;this.scene.add(this.camera);if(this.scene._amgScene==null){this.renderer=new THREE.WebGLRenderer({antialias:true});this.renderer.outputColorSpace=THREE.LinearSRGBColorSpace}if(this.renderer){this.renderer.setSize(window.innerWidth,window.innerHeight);this.renderer.setPixelRatio(window.devicePixelRatio)}this.sliders={};this.TWEEN=TWEEN;this.customEasings=customEasings;this.Duration=2e3}addShaderPass(shaderPassConfigs){if(!Array.isArray(shaderPassConfigs)){shaderPassConfigs=[shaderPassConfigs]}shaderPassConfigs.forEach(config=>{const atomicName=config.name;const className=atomicName.startsWith("Lumi")?atomicName.substring(4):atomicName;const shaderPassModule=require("../pp/Lumi"+className+"/"+className+"ShaderPass.js");const ShaderPassClass=shaderPassModule[className+"ShaderPass"];const initConfig=config&&(config.initConfig||config.config||config.params)||{};const shaderPass=new ShaderPassClass(initConfig);this.composer.addPass(shaderPass);this.shaderPasses.push(shaderPass)})}setupPostProcessing(shaderPassConfigs){const{EffectComposer}=require("./EffectComposer.js");const{RenderPass}=require("./RenderPass.js");this.composer=new EffectComposer(this.renderer);this.renderPass=new RenderPass(this.scene,this.camera);this.composer.addPass(this.renderPass);this.shaderPasses=[];this.addShaderPass(shaderPassConfigs)}initPostProcessing(){}init(container){if(this.renderer){if(container){container.appendChild(this.renderer.domElement)}else if(typeof document!=="undefined"){document.body.appendChild(this.renderer.domElement)}}if(typeof window!=="undefined"){window.addEventListener("resize",()=>this.handleResize())}}start(updateCallback){if(this.isAnimating)return;this.isAnimating=true;if(updateCallback){const animateFrame=()=>{if(!this.isAnimating)return;updateCallback();this.animationFrameId=requestAnimationFrame(animateFrame)};animateFrame()}else{this.renderer.setAnimationLoop(()=>{this.update()})}}updateScene(timestamp){if(!this.isAnimating){this.isAnimating=true}this.defaultUpdate(timestamp)}update(){if(this.usePostProcessing&&this.composer){if(this.renderPass){this.renderPass.camera=this.camera}this.composer.render()}else if(this.renderer){this.renderer.render(this.scene,this.camera)}}handleResize(){this.camera.aspect=window.innerWidth/window.innerHeight;this.camera.updateProjectionMatrix();if(this.renderer){this.renderer.setSize(window.innerWidth,window.innerHeight)}if(!this.isAnimating){this.update()}}loadTextures(){const textureLoader=new THREE.TextureLoader;return Promise.all([new Promise(resolve=>{this.texture1=textureLoader.load("image/Sample1.jpg",resolve);this.texture1.colorSpace=THREE.LinearSRGBColorSpace;this.texture1.wrapS=THREE.RepeatWrapping;this.texture1.wrapT=THREE.RepeatWrapping}),new Promise(resolve=>{this.texture2=textureLoader.load("image/Sample2.jpg",resolve);this.texture2.colorSpace=THREE.LinearSRGBColorSpace;this.texture2.wrapS=THREE.RepeatWrapping;this.texture2.wrapT=THREE.RepeatWrapping})])}_applyTweenInitialState(tween){if(!tween._propertiesAreSetUp){tween.start(0)}if(!tween._valuesStart||!tween._valuesEnd){return}tween._updateProperties(tween._object,tween._valuesStart,tween._valuesEnd,0);if(typeof tween._onUpdateCallback==="function"){tween._onUpdateCallback(tween._object,0)}}_applyTweenFinalState(tween){if(!tween._propertiesAreSetUp){tween.start(0)}if(!tween._valuesStart||!tween._valuesEnd){return}tween._updateProperties(tween._object,tween._valuesStart,tween._valuesEnd,1);if(typeof tween._onUpdateCallback==="function"){tween._onUpdateCallback(tween._object,1)}}seekToTime(time){if(!this.isAnimating){this.isAnimating=true}const clampedTime=Math.max(0,Math.min(time,this.Duration));if(this._predef_seekShaderPass){this._predef_seekShaderPass(clampedTime)}if(!this.sceneObjects.tweens||this.sceneObjects.tweens.length===0){return}let notStartTweens=[];let runningTweens=[];let finishedTweens=[];for(let i=0;i<=this.sceneObjects.tweens.length-1;i++){const tween=this.sceneObjects.tweens[i];let TweenStartTime=tween._delayTime+10;let TweenEndTime=tween._delayTime+tween._duration;if(clampedTime<=TweenStartTime){notStartTweens.push({time:TweenStartTime,tween:tween})}else if(clampedTime>=TweenEndTime){finishedTweens.push({time:TweenEndTime,tween:tween})}else{runningTweens.push(tween)}}notStartTweens.sort((a,b)=>b.time-a.time);finishedTweens.sort((a,b)=>a.time-b.time);notStartTweens.forEach(item=>{this._applyTweenInitialState(item.tween)});finishedTweens.forEach(item=>{this._applyTweenFinalState(item.tween)});runningTweens.forEach(tween=>{tween.stop();tween.start(0);tween.update(clampedTime)});this.update()}setupScene(){this.initSceneObjects();this.createFireWaveTransitionPlane();this.setupAnimations();return this.sceneObjects}initSceneObjects(){this.Duration=2e3;this.camera.position.set(0,0,10);this.camera.lookAt(0,0,0);this.sceneObjects={mainPlane:null,mainMaterial:null,tweens:[],uniforms:null}}createFireWaveTransitionPlane(){const geometry=new THREE.PlaneGeometry(10,10,1,1);geometry.name="FireWaveTransitionGeometry";const material=new THREE.ShaderMaterial({name:"FireWaveTransitionMaterial",side:THREE.DoubleSide,transparent:false,uniforms:{texture1:{value:this.texture1},texture2:{value:this.texture2},u_time:{value:0},u_direction:{value:1},u_waveFront:{value:0},u_fireIntensity:{value:0},u_fireHeight:{value:.05},u_fireDensity:{value:0},u_turbulence:{value:.1},u_emberDensity:{value:0},u_sparkRate:{value:0},u_smokeDensity:{value:0},u_heatDistort:{value:0},u_glow:{value:0},u_motionBlur:{value:0},u_brightness:{value:1},u_sceneMix:{value:0}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      uniform float u_time;
      uniform float u_direction;
      uniform float u_waveFront;
      uniform float u_fireIntensity;
      uniform float u_fireHeight;
      uniform float u_fireDensity;
      uniform float u_turbulence;
      uniform float u_emberDensity;
      uniform float u_sparkRate;
      uniform float u_smokeDensity;
      uniform float u_heatDistort;
      uniform float u_glow;
      uniform float u_motionBlur;
      uniform float u_brightness;
      uniform float u_sceneMix;

      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        float dir = u_direction > 0.5 ? 1.0 : -1.0;
        vec2 uv = vUv;
        float ux = dir > 0.0 ? uv.x : (1.0 - uv.x);

        float wavePos = mix(-0.15, 1.15, u_waveFront);
        float lead = ux - wavePos;

        float n1 = fbm(vec2(uv.x * 6.5 - u_time * 2.6, uv.y * 10.0 + u_time * 3.2));
        float n2 = fbm(vec2(uv.x * 11.0 - u_time * 3.7, uv.y * 13.0 + u_time * 4.4));
        float n3 = fbm(vec2(uv.x * 3.0 - u_time * 1.2, uv.y * 6.0 + u_time * 1.8));

        float flameFront = smoothstep(0.30 + u_fireHeight, -0.25, lead + (n1 - 0.5) * (0.45 + u_turbulence));
        float flameRoll = smoothstep(0.35, 1.0, n2 + n3 * 0.35);
        float flameLayerFG = flameFront * flameRoll * (0.55 + 0.45 * smoothstep(0.0, 1.0, 1.0 - uv.y));
        float flameLayerMG = smoothstep(0.20 + u_fireHeight * 0.7, -0.18, lead + (n2 - 0.5) * 0.35) * smoothstep(0.25, 0.95, n1);
        float flameLayerBG = smoothstep(0.12 + u_fireHeight * 0.4, -0.12, lead + (n3 - 0.5) * 0.25) * smoothstep(0.35, 0.9, n2);

        float flameAlpha = clamp(
          (flameLayerFG * 0.75 + flameLayerMG * 0.5 + flameLayerBG * 0.35) * (u_fireIntensity + u_fireDensity * 0.8),
          0.0, 1.0
        );

        float heatMask = clamp(flameAlpha * 0.9 + smoothstep(0.2, -0.05, lead) * u_fireDensity * 0.4, 0.0, 1.0);
        vec2 heatOffset = vec2(
          (noise(vec2(uv.x * 34.0 + u_time * 8.0, uv.y * 22.0 - u_time * 5.5)) - 0.5) * 0.020,
          (noise(vec2(uv.x * 21.0 - u_time * 6.0, uv.y * 37.0 + u_time * 4.0)) - 0.5) * 0.015
        ) * u_heatDistort * heatMask;

        vec2 blurDir = vec2(dir, 0.0) * 0.010 * u_motionBlur * smoothstep(-0.08, 0.35, -lead);
        vec4 sceneA = texture2D(texture1, clamp(uv + heatOffset, 0.0, 1.0));
        vec4 sceneB = texture2D(texture2, clamp(uv + heatOffset, 0.0, 1.0));
        vec4 sceneA2 = texture2D(texture1, clamp(uv + heatOffset - blurDir, 0.0, 1.0));
        vec4 sceneB2 = texture2D(texture2, clamp(uv + heatOffset - blurDir, 0.0, 1.0));
        sceneA = mix(sceneA, sceneA2, 0.35);
        sceneB = mix(sceneB, sceneB2, 0.35);

        float passedMask = 1.0 - smoothstep(-0.04, 0.09, lead);
        float coverAssist = smoothstep(0.35, 0.90, flameAlpha + u_fireDensity * 0.6 + u_glow * 0.4);
        float mixMask = clamp(max(u_sceneMix, passedMask * coverAssist), 0.0, 1.0);
        vec4 sceneColor = mix(sceneA, sceneB, mixMask);

        float smokeNoise = fbm(vec2(uv.x * 5.0 - u_time * 0.8, uv.y * 7.0 + u_time * 0.6));
        float smokeAlpha = smoothstep(0.35, 0.85, smokeNoise) * smoothstep(0.28, -0.18, lead) * u_smokeDensity;
        vec3 smokeColor = mix(vec3(0.08, 0.06, 0.05), vec3(0.22, 0.18, 0.16), smokeNoise);

        vec2 sparkGrid = floor(vec2(uv.x * 140.0 + u_time * 180.0 * dir, uv.y * 90.0 - u_time * 120.0));
        float sparkSeed = hash(sparkGrid);
        float spark = step(0.997 - u_sparkRate * 0.11, sparkSeed) * smoothstep(0.20, -0.20, lead) * smoothstep(0.0, 0.95, 1.0 - uv.y);
        float sparkTrail = spark * smoothstep(0.0, 0.7, fract(uv.x * 30.0 - u_time * 25.0));

        vec2 emberGrid = floor(vec2(uv.x * 90.0 - u_time * 60.0 * dir, uv.y * 70.0 + u_time * 85.0));
        float emberSeed = hash(emberGrid + 17.3);
        float ember = step(0.992 - u_emberDensity * 0.10, emberSeed) * smoothstep(0.26, -0.22, lead);

        float fireBody = clamp(flameAlpha * 1.35, 0.0, 1.0);
        float core = smoothstep(0.58, 1.0, fireBody + n2 * 0.25);
        float whiteHot = smoothstep(0.82, 1.0, fireBody + n1 * 0.20) * (0.6 + 0.4 * u_glow);

        vec3 outerColor = vec3(0.71, 0.23, 0.11);
        vec3 bodyColor = vec3(1.00, 0.52, 0.16);
        vec3 coreColor = vec3(1.00, 0.83, 0.34);
        vec3 whiteColor = vec3(1.0, 0.97, 0.92);

        vec3 flameColor = mix(outerColor, bodyColor, smoothstep(0.20, 0.72, fireBody));
        flameColor = mix(flameColor, coreColor, core);
        flameColor = mix(flameColor, whiteColor, whiteHot);

        float glowMask = clamp(flameAlpha * (0.45 + u_glow), 0.0, 1.0);
        vec3 fireLight = vec3(1.0, 0.62, 0.28) * glowMask * 0.55;

        sceneColor.rgb = mix(sceneColor.rgb, sceneColor.rgb * vec3(1.10, 1.03, 0.95) + fireLight, clamp(glowMask, 0.0, 0.65));
        sceneColor.rgb = mix(sceneColor.rgb, smokeColor, smokeAlpha * 0.55);

        sceneColor.rgb += flameColor * flameAlpha;
        sceneColor.rgb += vec3(1.0, 0.85, 0.55) * ember * 0.55;
        sceneColor.rgb += vec3(1.0, 0.92, 0.72) * spark * 0.85;
        sceneColor.rgb += vec3(1.0, 0.65, 0.25) * sparkTrail * 0.25;

        sceneColor.rgb *= u_brightness;
        gl_FragColor = vec4(clamp(sceneColor.rgb, 0.0, 1.0), 1.0);
      }
    `});const plane=new THREE.Mesh(geometry,material);plane.name="FireWaveTransitionPlane";plane.position.set(0,0,0);this.scene.add(plane);this.sceneObjects.mainPlane=plane;this.sceneObjects.mainMaterial=material;this.sceneObjects.uniforms=material.uniforms}_createUniformTween(uniformRef,startValue,endValue,duration,delay,easingFn){const startStatus={value:startValue};const endStatus={value:endValue};const tween=new TWEEN.Tween(startStatus).to(endStatus,duration).delay(delay).easing(easingFn).onUpdate(obj=>{uniformRef.value=obj.value}).start();this.sceneObjects.tweens.push(tween)}setupAnimations(){const uniforms=this.sceneObjects.uniforms;this.sceneObjects.tweens=[];this._createUniformTween(uniforms.u_time,0,1,1900,50,TWEEN.Easing.Linear.None);this._createUniformTween(uniforms.u_glow,0,.08,150,50,TWEEN.Easing.Sinusoidal.InOut);this._createUniformTween(uniforms.u_fireIntensity,0,.2,200,200,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_fireHeight,.05,.12,200,200,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_sparkRate,0,.18,200,200,TWEEN.Easing.Quadratic.Out);this._createUniformTween(uniforms.u_heatDistort,0,.08,200,200,TWEEN.Easing.Sinusoidal.InOut);this._createUniformTween(uniforms.u_waveFront,0,.3,300,400,TWEEN.Easing.Cubic.InOut);this._createUniformTween(uniforms.u_fireDensity,0,.35,300,400,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_emberDensity,0,.28,300,400,TWEEN.Easing.Quadratic.Out);this._createUniformTween(uniforms.u_smokeDensity,0,.18,300,400,TWEEN.Easing.Sinusoidal.InOut);this._createUniformTween(uniforms.u_turbulence,.1,.35,300,400,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_waveFront,.3,.5,300,700,TWEEN.Easing.Cubic.InOut);this._createUniformTween(uniforms.u_fireIntensity,.2,.55,300,700,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_fireHeight,.12,.32,300,700,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_heatDistort,.08,.26,300,700,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_glow,.08,.3,300,700,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_waveFront,.5,.7,300,1e3,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_fireDensity,.35,.7,300,1e3,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_emberDensity,.28,.55,300,1e3,TWEEN.Easing.Cubic.InOut);this._createUniformTween(uniforms.u_sparkRate,.18,.62,300,1e3,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_motionBlur,0,.2,300,1e3,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_waveFront,.7,.82,200,1300,TWEEN.Easing.Cubic.InOut);this._createUniformTween(uniforms.u_fireIntensity,.55,.9,200,1300,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_fireHeight,.32,.62,200,1300,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_smokeDensity,.18,.52,200,1300,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_heatDistort,.26,.6,200,1300,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_glow,.3,.7,200,1300,TWEEN.Easing.Cubic.In);this._createUniformTween(uniforms.u_brightness,1,1.55,50,1500,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_brightness,1.55,1,90,1550,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_sceneMix,0,1,140,1500,TWEEN.Easing.Linear.None);this._createUniformTween(uniforms.u_waveFront,.82,.92,160,1640,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_fireIntensity,.9,.55,160,1640,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_smokeDensity,.52,.32,160,1640,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_heatDistort,.6,.28,160,1640,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_fireDensity,.7,.2,120,1800,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_glow,.7,.12,120,1800,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_sparkRate,.62,.15,120,1800,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_emberDensity,.55,.2,120,1800,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_motionBlur,.2,.05,120,1800,TWEEN.Easing.Cubic.Out);this._createUniformTween(uniforms.u_fireIntensity,.55,0,30,1920,TWEEN.Easing.Quadratic.Out);this._createUniformTween(uniforms.u_smokeDensity,.32,0,30,1920,TWEEN.Easing.Quadratic.Out);this._createUniformTween(uniforms.u_heatDistort,.28,0,30,1920,TWEEN.Easing.Quadratic.Out);const camStartStatusA={z:10};const camEndStatusA={z:9.82};const camTweenA=new TWEEN.Tween(camStartStatusA).to(camEndStatusA,500).delay(900).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(obj=>{this.camera.position.z=obj.z;this.camera.lookAt(0,0,0)}).start();this.sceneObjects.tweens.push(camTweenA);const camStartStatusB={z:9.82};const camEndStatusB={z:9.7};const camTweenB=new TWEEN.Tween(camStartStatusB).to(camEndStatusB,55).delay(1460).easing(TWEEN.Easing.Cubic.Out).onUpdate(obj=>{this.camera.position.z=obj.z;this.camera.lookAt(0,0,0)}).start();this.sceneObjects.tweens.push(camTweenB);const camStartStatusC={z:9.7};const camEndStatusC={z:9.86};const camTweenC=new TWEEN.Tween(camStartStatusC).to(camEndStatusC,55).delay(1515).easing(TWEEN.Easing.Cubic.Out).onUpdate(obj=>{this.camera.position.z=obj.z;this.camera.lookAt(0,0,0)}).start();this.sceneObjects.tweens.push(camTweenC);const camStartStatusD={z:9.86};const camEndStatusD={z:9.81};const camTweenD=new TWEEN.Tween(camStartStatusD).to(camEndStatusD,50).delay(1570).easing(TWEEN.Easing.Cubic.Out).onUpdate(obj=>{this.camera.position.z=obj.z;this.camera.lookAt(0,0,0)}).start();this.sceneObjects.tweens.push(camTweenD);const camStartStatusE={z:9.81};const camEndStatusE={z:10};const camTweenE=new TWEEN.Tween(camStartStatusE).to(camEndStatusE,280).delay(1620).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(obj=>{this.camera.position.z=obj.z;this.camera.lookAt(0,0,0)}).start();this.sceneObjects.tweens.push(camTweenE)}defaultUpdate(timestamp){if(this.sceneObjects.tweens&&this.sceneObjects.tweens.length>0){this.sceneObjects.tweens.forEach(tween=>{if(tween&&typeof tween.update==="function"){tween.update(timestamp)}})}this.update()}_predef_addTopCenterBottomStyleBorder(parent,offset,texture,cutoutAreaPosition,cutoutAreaSize){const aspectRatio=this.texture1.image.width/this.texture1.image.height;const parentInitScale=parent.scale.y;const parentPosition=parent.position;const textureWidth=texture.image.width;const textureHeight=texture.image.height;const geometry=new THREE.PlaneGeometry(10,10);const textureCenter=texture.clone();textureCenter.repeat.set(1,cutoutAreaSize.y/textureHeight);textureCenter.offset.set(0,(textureHeight-cutoutAreaPosition.y-cutoutAreaSize.y)/textureHeight);const materialCenter=new THREE.MeshBasicMaterial({map:textureCenter,transparent:true,opacity:1,premultipliedAlpha:true,side:THREE.DoubleSide});materialCenter.name="PlaneCenterMaterial";const planeCenter=new THREE.Mesh(geometry,materialCenter);planeCenter.name="PlaneCenter";planeCenter.position.set(parentPosition.x+offset.x,parentPosition.y+offset.y,parentPosition.z+offset.z);planeCenter.scale.set(parentInitScale*aspectRatio/(cutoutAreaSize.x/textureWidth),parentInitScale,1);this.scene.add(planeCenter);parent.attach(planeCenter);const textureTop=texture.clone();textureTop.repeat.set(1,cutoutAreaPosition.y/textureHeight);textureTop.offset.set(0,1-cutoutAreaPosition.y/textureHeight);const materialTop=new THREE.MeshBasicMaterial({map:textureTop,transparent:true,opacity:1,premultipliedAlpha:true,side:THREE.DoubleSide});materialTop.name="PlaneTopMaterial";const scaleXTop=parentInitScale*aspectRatio/(cutoutAreaSize.x/textureWidth);const scaleYTop=scaleXTop*cutoutAreaPosition.y/textureWidth;const planeTop=new THREE.Mesh(geometry,materialTop);planeTop.name="PlaneTop";planeTop.position.set(parentPosition.x+offset.x,parentPosition.y+offset.y+parentInitScale*10*.5+scaleYTop*10*.5,parentPosition.z+offset.z);planeTop.scale.set(scaleXTop,scaleYTop,1);this.scene.add(planeTop);parent.attach(planeTop);const textureBottom=texture.clone();textureBottom.repeat.set(1,(textureHeight-cutoutAreaPosition.y-cutoutAreaSize.y)/textureHeight);textureBottom.offset.set(0,0);const materialBottom=new THREE.MeshBasicMaterial({map:textureBottom,transparent:true,opacity:1,premultipliedAlpha:true,side:THREE.DoubleSide});materialBottom.name="PlaneBottomMaterial";const scaleXBottom=parentInitScale*aspectRatio/(cutoutAreaSize.x/textureWidth);const scaleYBottom=scaleXBottom*(textureHeight-cutoutAreaPosition.y-cutoutAreaSize.y)/textureWidth;const planeBottom=new THREE.Mesh(geometry,materialBottom);planeBottom.name="PlaneBottom";planeBottom.position.set(parentPosition.x+offset.x,parentPosition.y+offset.y-parentInitScale*10*.5-scaleYBottom*10*.5,parentPosition.z+offset.z);planeBottom.scale.set(scaleXBottom,scaleYBottom,1);this.scene.add(planeBottom);parent.attach(planeBottom)}_predef_loadVideoTexture(path,loop,playbackRate){if(this.scene._amgScene==null){const video=document.createElement("video");video.src=path;video.muted=true;video.loop=loop;video.load();const videoTexture=new THREE.VideoTexture(video);videoTexture.currentTime=0;videoTexture.playbackRate=playbackRate;this.videoTexture=videoTexture;return videoTexture}else if(typeof this.scene._amgScene==="string"){return new THREE.Texture}else{const texture=new THREE.VideoTexture(path,loop,playbackRate);texture.load();return texture}}_predef_seekVideoTexture(time){if(this.videoTexture!=null){const videoTexture=this.videoTexture;const video=videoTexture.image;if(video.readyState>=2){const textureProperties=this.renderer.properties.get(videoTexture);var newTime=time/1e3*videoTexture.playbackRate;if(newTime<0){newTime=0}else if(newTime>video.duration){if(video.loop){newTime=newTime%video.duration}else{newTime=video.duration}}if(textureProperties.__version==videoTexture.version){videoTexture.currentTime=newTime;video.currentTime=videoTexture.currentTime}}}}_predef_seekShaderPass(time){if(!("shaderPasses"in this)||this.shaderPasses==null){return}this.shaderPasses.forEach(shaderPass=>{if(shaderPass.constructor.name==="AnimSeqLoadAndCropBlendShaderPass"){if(this.texture1&&this.texture1.image){const ratio=this.texture1.image.width/this.texture1.image.height;if(typeof shaderPass.setAspectRatio==="function"){shaderPass.setAspectRatio(ratio)}}}})}}exports.ScriptScene=ScriptScene;