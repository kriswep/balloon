/* globals test jest expect */
import WtBalloon from './wtballoon';

const getUpdatedProps = (obj, prop) => {
  obj.update();
  return prop.reduce((prev, currentProp) => {
    const newObject = {};
    newObject[currentProp] = obj[currentProp];
    return Object.assign({}, prev,
      newObject,
    );
  }, {});
};

const WTGM = {
  tex: 'tex',
  paused: 0,
  life: 10,
  decreaseLife: jest.fn(),
};

test('WtBalloon should have draw, update and isInside function', () => {
  const ballon = new WtBalloon(0, 700, 500, 5, WTGM);

  expect(ballon.draw).toBeDefined();
  expect(ballon.update).toBeDefined();
  expect(ballon.isInside).toBeDefined();
});

test('WtBalloon draw should draw balloon at its position', () => {
  const context = {
    drawImage: jest.fn(),
  };
  // ballon 0
  const ballon0 = new WtBalloon(0, 700, 500, 5, WTGM);
  const expected0 = ['tex', 0, 0, 128, 128, 700, 500, 64, 64];
  ballon0.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected0);

  // ballon 1
  context.drawImage.mockClear();
  const ballon1 = new WtBalloon(1, 700, 500, 5, WTGM);
  const expected1 = ['tex', 0, 178, 64, 128, 700, 500, 32, 64];
  ballon1.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected1);

  // ballon 2
  context.drawImage.mockClear();
  const ballon2 = new WtBalloon(2, 700, 500, 5, WTGM);
  const expected2 = ['tex', 0, 356, 64, 128, 700, 500, 32, 64];
  ballon2.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected2);

  // ballon 3
  context.drawImage.mockClear();
  const ballon3 = new WtBalloon(3, 700, 500, 5, WTGM);
  const expected3 = ['tex', 0, 534, 64, 128, 700, 500, 32, 64];
  ballon3.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected3);

  // ballon 4
  context.drawImage.mockClear();
  const ballon4 = new WtBalloon(4, 700, 500, 5, WTGM);
  const expected4 = ['tex', 0, 712, 128, 128, 700, 500, 64, 64];
  ballon4.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected4);

  // ballon 5
  context.drawImage.mockClear();
  const ballon5 = new WtBalloon(5, 700, 500, 5, WTGM);
  const expected5 = ['tex', 0, 890, 64, 128, 700, 500, 32, 64];
  ballon5.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected5);

  // ballon 6
  context.drawImage.mockClear();
  const ballon6 = new WtBalloon(6, 700, 500, 5, WTGM);
  const expected6 = ['tex', 0, 1068, 128, 128, 700, 500, 64, 64];
  ballon6.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected6);

  // ballon 7
  context.drawImage.mockClear();
  const ballon7 = new WtBalloon(7, 700, 500, 5, WTGM);
  const expected7 = ['tex', 0, 1246, 128, 128, 700, 500, 64, 64];
  ballon7.draw(context);

  expect(context.drawImage.mock.calls.length).toBe(1);
  expect(context.drawImage.mock.calls[0]).toEqual(expected7);
});

test('WtBalloon should update regularly at high fps', () => {
  const balloon = new WtBalloon(0, 700, 500, 5, WTGM);

  // lets just fake the time
  global.Date = jest.fn();
  global.Date.mockImplementation(() => ({
    getTime: () => balloon.lastUpdate + 10,
  }));
  const actual = getUpdatedProps(balloon, ['x', 'y']);
  expect(
    actual.x,
  ).not.toBe(700);
  expect(
    actual.y,
  ).toBeLessThan(500);
});

test('WtBalloon should remove than it leaves the screen', () => {
  // lets do a highspeed ballon, which leaves screen on first render
  const balloon = new WtBalloon(0, 700, 500, 600, WTGM);

  // lets just fake the time
  global.Date = jest.fn();
  global.Date.mockImplementation(() => ({
    getTime: () => balloon.lastUpdate + 10,
  }));
  const actual = getUpdatedProps(balloon, ['y', 'remove']);
  expect(
    actual.remove,
  ).toBeTruthy();
  expect(
    actual.y,
  ).toBeLessThan(0);
  expect(WTGM.decreaseLife).toBeCalled();
});

test('WtBalloon should not update at low fps', () => {
  const balloon = new WtBalloon(0, 700, 500, 5, WTGM);

  // lets just fake the time
  global.Date = jest.fn();
  global.Date.mockImplementation(() => ({
    getTime: () => balloon.lastUpdate + 90,
  }));
  // do it several times to trigger branch
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 1 });
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 2 });
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 3 });
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 4 });
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 5 });
  expect(
    getUpdatedProps(balloon, ['x', 'y', 'pauseFrame']),
  ).toEqual({ x: 700, y: 500, pauseFrame: 0 });
});

test('WtBalloon should not update when paused', () => {
  const PausedWTGM = {
    tex: 'tex',
    paused: 1,
    life: 10,
  };
  const balloon = new WtBalloon(0, 700, 500, 5, PausedWTGM);

  // lets just fake the time
  global.Date = jest.fn();
  global.Date.mockImplementation(() => ({
    getTime: () => balloon.lastUpdate + 10,
  }));
  expect(
    getUpdatedProps(balloon, ['x', 'y']),
  ).toEqual({ x: 700, y: 500 });
});


test('WtBalloon isInside should check if point is inside balloon', () => {
  const balloon = new WtBalloon(0, 700, 500, 5, WTGM);
  expect(balloon.isInside(0, 0)).toBeFalsy();
  expect(balloon.isInside(701, 501)).toBeTruthy();
  balloon.remove = 1;
  expect(balloon.isInside(701, 501)).toBeFalsy();
});
