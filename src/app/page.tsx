import { Spacer } from "@/app/_components/Spacer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Logo() {
  return (
    <div className="relative h-8 w-8 laptop:h-80 laptop:w-80">
      <Image src={"/logo.svg"} alt="" fill />
    </div>
  );
}

export default async function Page() {
  return (
    <div className="flex h-full flex-col justify-center ">
      <div className="flex w-full max-w-7xl flex-1 shrink-0 items-center justify-center px-8 md:px-0 laptop:mx-auto laptop:gap-60">
        <div className="fixed left-12 top-12 laptop:relative">
          <Logo />
        </div>
        <section>
          <h1 className="text-4xl font-bold tablet:text-7xl">Happening now</h1>
          <Spacer className="my-12" />
          <div className="max-w-[288px]">
            <p className="text-3xl font-bold">Join today.</p>
            <Spacer className="my-6" />
            <div className="flex flex-col gap-3">
              <form>
                <Link
                  className="block w-full  rounded-full bg-primary py-2 text-center text-sm font-semibold text-white"
                  href="/signup"
                >
                  Create Account
                </Link>
              </form>

              <p className="text-xs">
                By signing up, you agree to the{" "}
                <span className="text-primary">Terms of Service</span> and
                <span className="text-primary">Privacy Policy</span>, including
                <span className="text-primary"> Cookie Use</span>.
              </p>
            </div>
            <Spacer className="my-16" />
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">Already have an account?</p>
              <Link
                href="/login"
                className="w-full rounded-full border border-white/20 py-2 text-center text-primary"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="hidden pb-4">
        <ul className="mx-auto flex max-w-[1600px] gap-4 text-xs text-neutral-400">
          <FooterLink href="https://about.twitter.com/en" text="About" />
          <FooterLink
            href="https://help.twitter.com/using-x/download-the-x-app"
            text="Download the X app"
          />
          <FooterLink href="https://help.twitter.com/" text="Help Center" />
          <FooterLink href="https://twitter.com/tos" text="Terms of Service" />
          <FooterLink
            href="https://twitter.com/privacy"
            text="Privacy Policy"
          />
          <FooterLink
            href="https://support.twitter.com/articles/20170514"
            text="Cookie Policy"
          />
          <FooterLink
            href="https://help.twitter.com/resources/accessibility"
            text="Accessibility"
          />
          <FooterLink
            href="https://business.twitter.com/en/help/troubleshooting/how-twitter-ads-work.html?ref=web-twc-ao-gbl-adsinfo&utm_source=twc&utm_medium=web&utm_campaign=ao&utm_content=adsinfo"
            text="Ads info"
          />
          <FooterLink href="https://blog.twitter.com/" text="Blog" />
          <FooterLink href="https://status.twitterstat.us/" text="Status" />
          <FooterLink href="https://careers.twitter.com/" text="Careers" />
          <FooterLink
            href="https://about.twitter.com/press/brand-assets"
            text="Brand Resources"
          />
          <FooterLink
            href="https://ads.twitter.com/?ref=gl-tw-tw-twitter-advertise"
            text="Advertising"
          />
          <FooterLink href="https://marketing.twitter.com/" text="Marketing" />
          <FooterLink
            href="https://business.twitter.com/?ref=web-twc-ao-gbl-twitterforbusiness&utm_source=twc&utm_medium=web&utm_campaign=ao&utm_content=twitterforbusiness"
            text="X for Business"
          />
          <FooterLink href="https://developer.twitter.com/" text="Developers" />
          <FooterLink
            href="https://twitter.com/i/directory/profiles"
            text="Directory"
          />
          <FooterLink href="https://twitter.com/settings" text="Settings" />
        </ul>
      </footer>
    </div>
  );
}

const FooterLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <li>
      <Link
        href={href}
        target="_blank"
        className="tracking-wide hover:underline"
      >
        {text}
      </Link>
    </li>
  );
};
