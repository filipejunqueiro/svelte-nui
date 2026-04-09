const inBrowser = (): boolean => {
  if (typeof window !== "undefined" && (window as any).invokeNative) return false;

  return true;
};

export default inBrowser;
