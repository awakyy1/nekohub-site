import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import stylesheet from "./styles.css?url";

export const links = () => [{ rel: "stylesheet", href: stylesheet }];
export const meta = () => [
  { title: "nekoHub | Linux fleet management for the terminal" },
  { name: "description", content: "A fast, open source TUI for monitoring and managing Linux machines from one calm terminal workspace." }
];

export function Layout({ children }) {
  return <html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><Meta/><Links/></head><body>{children}<ScrollRestoration/><Scripts/></body></html>;
}
export default function App(){ return <Outlet/>; }
