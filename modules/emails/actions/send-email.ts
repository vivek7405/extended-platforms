"use server";

import { ReactElement, JSXElementConstructor } from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test,
}: {
  email: string | string[];
  subject: string;
  react:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | null
    | undefined;
  marketing?: boolean;
  test?: boolean;
}) => {
  const text = render(react!, {
    plainText: true,
  });

  // const html = render(react!, {
  //   pretty: true,
  // });

  const mail = {
    from: marketing
      ? "X from Platforms <x@platforms.co>"
      : "Platforms <system@platforms.co>",
    to: test ? "delivered@resend.dev" : email,
    subject,
    react,
    text,
    // html,
  };

  console.log("email", mail);

  return resend.emails.send(mail);
};
