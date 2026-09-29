import { Link } from "@remix-run/react";

const mark = " /\\       __        __ __     __ /\\\n  ___  ___ / /_____  / // /_ __/ /\n / _ \\/ -_)  '_/ _ \\/ _  / // / _ \\\n/_//_/\\__/_/\\_\\\\___/_//_/\\_,_/_.__/";

export default function BrandLogo({ to = "#top" }) {
  const contents = <pre>{mark}</pre>;
  const label = "nekoHub home";

  return to.startsWith("#") ? (
    <a className="logo ascii-logo" href={to} aria-label={label}>{contents}</a>
  ) : (
    <Link className="logo ascii-logo" to={to} aria-label={label}>{contents}</Link>
  );
}
