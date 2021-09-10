import * as THREE from 'three';
import debounce from 'js-util/debounce';

import WebGLContent from './WebGLContent';

export default async function() {
  const webglContent = new WebGLContent();
  const resolution = new THREE.Vector2(); // 2D 벡터 클라스
  const canvas = document.getElementById('canvas-webgl');
  const preloader = document.querySelector('.p-preloader');

  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, document.body.clientHeight); // x, y 값의 위치를 2D로 지정 x: 화면의 body 넓이, y: 화면의 높이
    canvas.width = resolution.x; // canvas의 넓이를 body넓이로 지정
    canvas.height = resolution.y; // canvas의 높이를 화면의 높이로 지정
    // console.log(document.body);
    // console.log("x : " + document.body.clientWidth);
    // console.log("y : " + document.body.clientHeight);
    // console.log("rx : " + resolution.x);
    // console.log("ry : " + resolution.y);
    webglContent.resize(resolution);
  };
  const on = () => {
    window.addEventListener('blur', () => {
      webglContent.pause();
    });
    window.addEventListener('focus', () => {
      webglContent.play();
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };
  const update = () => {
    // console.log("==============");
    webglContent.update();
    requestAnimationFrame(update);
    // requestAnimationFrame(webglContent.play());
    // webglContent.pause();
  };

  await webglContent.start(canvas);

  on();
  resizeWindow(); // 화면창에 맞게 크기 조절
  preloader.classList.add('is-hidden');
  webglContent.play();
  update();
}
