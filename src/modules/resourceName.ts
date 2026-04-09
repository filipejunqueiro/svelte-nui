import inBrowser from "./inBrowser.ts";

const resourceName = (): string => {
  if (!inBrowser() && (window as any).GetParentResourceName)
    return (window as any).GetParentResourceName() as string;

  return "cfx-resource-name";
};

export default resourceName;
