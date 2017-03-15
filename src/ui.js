/* globals document */
// import $ from 'jquery/dist/jquery.min';
import WTGM from './wtgm';


function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function addListenerMulti(el, s, fn) {
  if (el && s && fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }
}

const initUI = () => {
  // $('.startGame').on('mousedown touchstart'
  addListenerMulti(document.querySelector('.startGame'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.setScore();
    WTGM.startGame();
    // $('.ui').hide();
    document.querySelector('.ui').style.display = 'none';
    // $('canvas').show();
    document.querySelector('canvas').style.display = '';
    // $('.openMenu').show();
    document.querySelector('.openMenu').style.display = 'inline';
  });

  // $('.toBaby').on('mousedown touchstart',
  addListenerMulti(document.querySelector('.toBaby'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    document.location.href = 'baby.html';
  });

  // $('.toKids').on('mousedown touchstart',
  addListenerMulti(document.querySelector('.toKids'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    document.location.href = 'index.html';
  });

  // $('.openMenu').on('mousedown touchstart',
  addListenerMulti(document.querySelector('.openMenu'), 'mousedown touchstart', (e) => {
    e.preventDefault();
    WTGM.paused = 1;
    if (!WTGM.hit) {
      WTGM.hit = 1;// keine minuspunkte
    }
    // $('.startGame').text('Neustart');
    document.querySelector('.startGame').textContent = 'Neustart';

    // $('.inGameOption').show();
    document.querySelector('.inGameOption').style.display = 'list-item';
    // $('.inMenuOption').hide();
    // document.querySelector('.inMenuOption').style.display = 'none';
    // $('.ui').addClass('gameRunning');
    document.querySelector('.ui').classList.add('gameRunning');
    // $('.ui').show();
    document.querySelector('.ui').style.display = '';
    // $('.openMenu').hide();
    document.querySelector('.openMenu').style.display = 'none';
  });

  // $('.resumeGame').on('mousedown touchstart',
  addListenerMulti(document.querySelector('.resumeGame'), 'mousedown touchstart', (e) => {
    e.preventDefault();

    if (!WTGM.hit) {
      WTGM.hit = 1; // keine minuspunkte
    }
    // $('.ui').hide();
    document.querySelector('.ui').style.display = 'none';
    // $('.openMenu').show();
    document.querySelector('.openMenu').style.display = 'inline';

    WTGM.paused = 0;
  });
};

ready(initUI);
