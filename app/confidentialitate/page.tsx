import { InfoPageView, infoPageMetadata } from "@/components/InfoPageView";

export function generateMetadata() {
  return infoPageMetadata("privacy");
}

export default function Page() {
  return <InfoPageView pageKey="privacy" />;
}
