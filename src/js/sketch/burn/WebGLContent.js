import * as THREE from 'three';

import Camera from './Camera';
import ImageGroup from './ImageGroup';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const texLoader = new THREE.TextureLoader();

// ==========
// Define unique variables
//
const imageGroup = new ImageGroup();

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    renderer = new THREE.WebGL1Renderer({ // 플러그인을 사용하지 않고 open source를 이용하여 3D 웹 콘텐츠를 제작하게 하는 WebGL을 사용하게 해줌
      alpha: true, // 캔버스테 알파(투명도) 버퍼가 포함되어 있는지 여부 default : false
      antialias: true, // 깨짐 현상 표현 여부 default : false
      canvas: canvas, // 콘텐츠가 그려질 canvas. 없으면 새로 생성됨.
    });
    // console.log(window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio); // 디스플레이의 픽셀 비율 지정. 주로 HiDPI 장비에서 흐려지는 것을 방지하기 위하여 쓰임
    renderer.setClearColor('#ffffff', 1.0); // clear color 와 투명도 설정 setClearColor(color, alpha)

    await Promise.all([
      texLoader.loadAsync('/sketch-threejs/img/sketch/burn/noise.png'), // 이미지 파일 로더
      // base64 이미지 파일 로더
      THREE.ImageUtils.loadTexture( 'data:image/png;base64,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q1Klin3wwQeJ+n/mzBkbMGCAbd++3fLly2cjRoywggUL2tmzZ+29996z1157zX1WqFAhd+3WrVutX79+du7cOWvWrJm1b98+0T0PHTpkCxcutFOnTln//v3d9z/++KP16tXLDhw4YFdeeaX94x//sBtvvNF27drl7qd2FClSxNm6/PLLQ47T5MmTXZt0b5U+ffrYrFmzLGvWrO7fGzdutAIFCtjXX39tL730ku3bt8/Vz5QpU6zHHfsQgAAEPCfgieAMHDjQPcRV9HcJSlKCs3jxYtu9e7ero4fzm2++aePGjbNXX33VLly4YO+8845NmTLFCc7FixetfPnytnz5csufP781bNjQRo0aZbfffnscyKNHj1qPHj2sRIkS9r///c9eeeUV993w4cPt5ptvtqZNm9ratWvdPWSjfv36JiG54YYbXN1bb73VHn300UQD89///tfatm1refPmjROcjh07un5KIAPl/PnzVrNmTfd5tWrVPB9gDEIAAhC4VAhEXXC0qvjhhx+ciKgUL17crrnmGvdbfqgVjoSmevXqdv/999vp06fdamjnzp1xvJo3b25///vfneB899139pe//MVWrlzpvh8zZoz7vEGDBon4asU0b968OMHZtGmTE6HcuXPbl19+aYMGDXKrk0CRmPXt29cefPBBq1q1aqL7SVxat27tbAZWOLK7YMECu+KKK+Lqy45EVEJIgQAEIOBnAlEXHK1kJk2a5ERBD/HatWvb008/7VYVoQTnhRdecFtj5cqVc+OiFYa2vQIlWHC0Vda7d28nJCozZsxw21+6PmFJKDjB32u1IyGsW7eu+3jRokVOgEqVKmX//Oc/TZCCy5o1a9z2WKNGjaxbt25xgqPV1k033eSEsHPnzq4dU6dOtW3btrktPG3TDR061IoWLernOUffIQABnxKIuuBopaKHrba8JDh6GGuFo4d2JIJTuHBh++KLLyIWHK0udK6zZ88etz3WpUsXd21SgvP+++/b66+/7kQxuPz+++/2t7/9ze699163Qps7d647j9G2W6tWrZzInTx5Mp7g6HxKIiVh0Wpn9uzZ9sYbb5i29SQ0Eilt761YscKn041uQwACfiYQdcG5++67rVatWvbss886zjqcX79+vTtQT2pLTVtY+tGWWuXKlW3Hjh0hBUfipW2tVatWue9TsqWm+vv377fnn3/e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' ),
      // texLoader.loadAsync('/sketch-threejs/img/sketch/burn/image02.jpg'),
      // texLoader.loadAsync('/sketch-threejs/img/sketch/burn/image03.jpg'),
    ]).then((response) => {
      console.log(response)
      const noiseTex = response[0];
      const imgTexes = response.slice(1);

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;

      imageGroup.start(noiseTex, imgTexes);

      scene.add(imageGroup);
    });

    camera.start();
  }
  play() {
    clock.start();
    this.update();
    // clock.stop();
  }
  pause() {
    clock.stop();
  }
  update() {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update Camera.
    // camera.update(time);

    // Update each objects.
    imageGroup.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
    
  }
  resize(resolution) {
    // camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
    imageGroup.resize(camera, resolution);
  }
}
