"use client";

import { cn } from "cn";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
} from "@/components/ui/tabs";
import type { Line, Sample, Tone } from "../data/api-samples";

/** Colour per token role. Kept inline so a sample can never drift out of sync. */
const toneClass: Record<Tone, string> = {
  method: "text-emerald-300 font-semibold",
  path: "text-white/85",
  hdr: "text-white/40",
  key: "text-teal-300",
  str: "text-amber-200/90",
  num: "text-cyan-300",
  punct: "text-white/35",
  cmt: "text-white/35",
  ok: "text-emerald-300 font-semibold",
};

function CodeBlock({ lines }: { lines: Line[] }) {
  return (
    <pre
      dir="ltr"
      className="max-h-104 overflow-auto p-5 font-mono text-[13px] leading-6"
    >
      <code>
        {lines.map((segments, index) => (
          <div key={index} className="whitespace-pre">
            {segments.map((segment, i) => (
              <span
                key={i}
                className={segment.c ? toneClass[segment.c] : undefined}
              >
                {segment.t}
              </span>
            ))}
          </div>
        ))}
      </code>
    </pre>
  );
}

export function ApiSamples({ samples }: { samples: Sample[] }) {
  return (
    <Tabs defaultValue={samples[0].id} className="gap-0">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </span>
        <span className="ms-1 truncate text-sm font-medium text-white/50">
          api.fatoorahub.dev
        </span>
      </div>

      <TabsList
        className={cn(
          tabsListVariants(),
          "h-auto gap-1 rounded-none border-0 border-b border-white/10 bg-transparent p-2",
        )}
      >
        {samples.map((sample) => (
          <TabsTrigger
            key={sample.id}
            value={sample.id}
            className="text-xs text-white/50 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            {sample.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {samples.map((sample) => (
        <TabsContent key={sample.id} value={sample.id}>
          <CodeBlock lines={sample.lines} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
