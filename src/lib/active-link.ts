import config from "../config";

/** Primary nav `activeLink` for `/topics/<slug>/` when that topic has a nav item. */
export function activeLinkForTopicPathname(pathname: string): string {
  const match = /^\/topics\/([^/]+)\/?$/.exec(pathname);
  if (!match) {
    return "";
  }
  const navKey = `topics/${match[1]}`;
  return config.navLinks.some((item) => item.link === navKey) ? navKey : "";
}