import type { MetaFunction } from "@remix-run/node";
import WaveMorph from "~/components/wave-morph";

export const meta: MetaFunction = () => {
  return [
    { title: "Wave Morph" },
    { name: "description", content: "Wave Morph" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <WaveMorph />
    </div>
  );
}
