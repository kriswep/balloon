/* globals document */
import WTGM from './wtgm';
import sound from './sound';


export function addListenerMulti(el, s, fn) {
  if (el && s && fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }
}

export function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export const initUI = () => {
  addListenerMulti(document.querySelector('.startGame'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.setScore();
    WTGM.startGame();
    document.querySelector('.ui').style.display = 'none';
    document.querySelector('canvas').style.display = '';
    document.querySelector('.openMenu').style.display = 'inline';
  });

  addListenerMulti(document.querySelector('.toBaby'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.toggleBaby();
    document.querySelector('.toBaby').style.display = 'none';
    document.querySelector('.toKids').style.display = '';
    // e.preventDefault();
    // document.location.href = 'baby.html';
  });

  addListenerMulti(document.querySelector('.toKids'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.toggleBaby();
    document.querySelector('.toBaby').style.display = '';
    document.querySelector('.toKids').style.display = 'none';
    // document.location.href = 'index.html';
  });

  addListenerMulti(document.querySelector('.openMenu'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.paused = 1;
    if (!WTGM.hit) {
      WTGM.hit = 1;// keine minuspunkte
    }
    document.querySelector('.startGame').textContent = 'Restart';

    document.querySelector('.inGameOption').style.display = 'list-item';
    document.querySelector('.ui').classList.add('gameRunning');
    document.querySelector('.ui').style.display = '';
    document.querySelector('.openMenu').style.display = 'none';
  });

  addListenerMulti(document.querySelector('.resumeGame'), 'mousedown touchstart', (e) => {
    e.preventDefault();

    if (!WTGM.hit) {
      WTGM.hit = 1; // keine minuspunkte
    }
    document.querySelector('.ui').style.display = 'none';
    document.querySelector('.openMenu').style.display = 'inline';

    WTGM.paused = 0;
  });
  // console.log(document.querySelector('.soundVolume').value);
  if (document.querySelector('.soundVolume')) {
    document.querySelector('.soundVolume').value = sound.getVolume();
  }
  addListenerMulti(document.querySelector('.soundVolume'), 'change', (e) => {
    e.preventDefault();
    sound.setVolume(e.target.value);
  });
};

ready(initUI);
