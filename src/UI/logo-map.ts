import aibLogo from "../img/aib-logo.png";
import boiLogo from "../img/boi-logo-1.png";
import ebsLogo from "../img/ebs-logo.png";
import kbcLogo from "../img/kbc-logo.png";

export const bankLogoMap = new Map<string, { logo: string; name: string }>([
  [
    "aibLogo",
    {
      logo: aibLogo,
      name: "AIB",
    },
  ],
  ["ebsLogo", { logo: ebsLogo, name: "EBS" }],
  ["kbcLogo", { logo: kbcLogo, name: "KBC" }],
  ["boiLogo", { logo: boiLogo, name: "Bank Of Ireland" }],
]);
