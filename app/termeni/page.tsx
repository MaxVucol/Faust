import { InfoPageView, infoPageMetadata } from "@/components/InfoPageView";

export function generateMetadata() {
  return infoPageMetadata("terms");
}

export default function Page() {
  return <InfoPageView pageKey="terms" />;
}
