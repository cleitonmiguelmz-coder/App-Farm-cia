// Safari 15 (iPhone 6s/7/8) não tem estas APIs. Corre antes de a app arrancar.
if (typeof URL.canParse !== "function") {
  Object.defineProperty(URL, "canParse", {
    configurable: true,
    writable: true,
    value: (url: string, base?: string) => {
      try {
        new URL(url, base);
        return true;
      } catch {
        return false;
      }
    },
  });
}

if (typeof Object.hasOwn !== "function") {
  Object.defineProperty(Object, "hasOwn", {
    configurable: true,
    writable: true,
    value: (target: object, key: PropertyKey) =>
      Object.prototype.hasOwnProperty.call(target, key),
  });
}

if (typeof Array.prototype.at !== "function") {
  Object.defineProperty(Array.prototype, "at", {
    configurable: true,
    writable: true,
    value: function (this: unknown[], index: number) {
      let i = Math.trunc(index) || 0;
      if (i < 0) i += this.length;
      return this[i];
    },
  });
}
