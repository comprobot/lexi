import "server-only";
import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

interface ClearCookieProps {
  prefix: string;
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const cookies = await getCookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined,
    secure: isProduction,
  });
};

export const clearAuthCookie = async ({ prefix }: ClearCookieProps) => {
  const cookies = await getCookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookies.set({
    name: `${prefix}-token`,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined,
    secure: isProduction,
    expires: new Date(0), // Set expiry to past date to clear the cookie
  });
};
