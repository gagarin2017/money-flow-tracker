import aibLogo from "../img/aib-logo.png";
import boiLogo from "../img/boi-logo-1.png";
import ebsLogo from "../img/ebs-logo.png";
import kbcLogo from "../img/kbc-logo.png";

export const bankLogos = ["aibLogo", "boiLogo"];

export const bankLogoMap = new Map<string, { img: string; desc: string }>([
  [
    "aibLogo",
    {
      img: aibLogo,
      desc: "Allied Irish Banks",
    },
  ],
  ["ebsLogo", { img: ebsLogo, desc: "EBS" }],
  ["kbcLogo", { img: kbcLogo, desc: "KBC" }],
  ["boiLogo", { img: boiLogo, desc: "Bank Of Ireland" }],
]);
