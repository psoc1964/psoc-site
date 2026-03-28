export enum Route {
  Home = "/",
  Login = "/login",
  Forgot = "/forgot",
  SignUp = "/join",
  Album = "/album",
  Admin = "/admin",
}

export function getRoute(route: keyof typeof Route) {
  return process.env.NEXT_PUBLIC_BASE_URL + Route[route];
}

export type NavItemType = "route" | "scroll";

export type NavItem = {
  label: string;
  type: NavItemType;
  route: keyof typeof Route;
  targetId?: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Home",
    type: "scroll",
    route: "Home",
    targetId: "home",
  },
  {
    label: "Album",
    type: "route",
    route: "Album",
  },
  {
    label: "About Us",
    type: "scroll",
    route: "Home",
    targetId: "about",
  },
];
