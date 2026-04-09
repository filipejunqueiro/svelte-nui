const inBrowser = (): boolean => {
  if ((window as any).invokeNative) return false;

  return true;
};

export default inBrowser;
