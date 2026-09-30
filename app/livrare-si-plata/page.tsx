import { InfoPageView, infoPageMetadata } from "@/components/InfoPageView";

export function generateMetadata() {
  return infoPageMetadata("delivery");
}

export default function Page() {
  return <InfoPageView pageKey="delivery" />;
}
