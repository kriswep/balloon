/* globals Image Audio */
// ResourceLoader class

export const ResourceType = {
  IMAGE: 0,
  // SOUND: 1,
};

export default function ResourceLoader(onPartial, onComplete) {
  this.resources = [];
  this.resourcesLoaded = 0;

  if (onPartial !== undefined && typeof (onPartial) === 'function') {
    this.onPartial = onPartial;
  }

  if (onComplete !== undefined && typeof (onComplete) === 'function') {
    this.onComplete = onComplete;
  }
}

ResourceLoader.prototype.addResource = function addResource(filePath, fileType, resourceType) {
  if (resourceType === ResourceType.IMAGE) {
    const res = {
      filePath,
      fileType,
      resourceType,
    };

    this.resources.push(res);
  }
};

ResourceLoader.prototype.startPreloading = function startPreloading() {
  for (let i = 0, len = this.resources.length; i < len; i += 1) {
    // switch (this.resources[i].resourceType) {
    //   case ResourceType.IMAGE:
    const img = new Image();
    img.addEventListener('load', this.onResourceLoaded.bind(this), false);
    img.src = this.resources[i].filePath;
    // break;
    // case ResourceType.SOUND:
    //   var a = new Audio();

    //   // Only preload sound files that we can play.
    //   if (a.canPlayType(this.resources[i].fileType) === 'probably') {
    //     a.src = this.resources[i].filePath;
    //     a.type = this.resources[i].fileType;

    //     var rl = this;
    //     a.addEventListener('canplaythrough', function () {
    //       a.removeEventListener('canplaythrough', arguments.callee, false);
    //       rl.onResourceLoaded();
    //     }, false);
    //   } else {
    //     // Can't play the sound. Assume that the resource is loaded.
    //     this.onResourceLoaded();
    //   }

    //   break;
    // default:
    //   break;
    // }
  }
};

ResourceLoader.prototype.onResourceLoaded = function onResourceLoaded() {
  this.resourcesLoaded += 1;

  if (this.onPartial !== undefined) {
    this.onPartial();
  }

  if (this.resourcesLoaded === this.resources.length) {
    if (this.onComplete !== undefined) {
      this.onComplete();
    }
  }
};

ResourceLoader.prototype.isLoadComplete = function isLoadComplete() {
  if (this.resources.length === this.resourcesLoaded) {
    return true;
  }
  return false;
};
