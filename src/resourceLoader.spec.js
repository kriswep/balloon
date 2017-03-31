/* globals test expect jest */
import ResourceLoader, { ResourceType } from './resourceLoader';


test('ResourceLoader should have addResource, startPreloading and isLoadComplete function', () => {
  const resourceLoader = new ResourceLoader();

  expect(resourceLoader.addResource).toBeDefined();
  expect(resourceLoader.startPreloading).toBeDefined();
  expect(resourceLoader.isLoadComplete).toBeDefined();

  // no crash
  resourceLoader.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  resourceLoader.startPreloading();
  expect(resourceLoader.resources.length).toBe(1);
});


test('ResourceLoader accepts resources to preload', (done) => {
  let partials = 0;
  const resourceLoader = new ResourceLoader(
    () => {
      partials += 1;
    }, // some resources are loaded
    () => {
      expect(partials).toBe(2);
      expect(resourceLoader.isLoadComplete()).toBeTruthy();
      done();
    }, // all resources are loaded
  );
  // add some resources to load
  resourceLoader.addResource('./img/sprite.png', null, ResourceType.IMAGE);
  resourceLoader.addResource('./img/back.png', null, ResourceType.IMAGE);
  resourceLoader.addResource('./img/unknown.res', null, 99);
  expect(resourceLoader.resources.length).toBe(2);
  // shouldn't be loaded right away
  expect(resourceLoader.isLoadComplete()).toBeFalsy();
  // load 'em
  resourceLoader.startPreloading();
});
