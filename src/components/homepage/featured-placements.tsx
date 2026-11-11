import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { FeaturedPlacement } from "@/types/database";
import { cn } from "@/lib/utils";

export function FeaturedPlacements({
 placements,
}: {
 placements: FeaturedPlacement[];
}) {
 const slots = [1, 2, 3].map(
 (index) => placements.find((p) => p.slot_index === index) ?? null,
 );
 const anyActive = slots.some((s) => s?.is_active);

 if (!anyActive) {
 return (
 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 {slots.map((_, i) => (
 <div
 key={i}
 className="flex h-20 items-center justify-center border border-dashed border-border/80 bg-card/40 text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
 >
 Featured placement
 </div>
 ))}
 </div>
 );
 }

 return (
 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 {slots.map((slot, i) => {
 if (!slot?.is_active) {
 return (
 <div
 key={i}
 className="h-20 border border-dashed border-border/80 bg-card/30"
 />
 );
 }

 const content = (
 <div
 className={cn(
 "relative flex h-20 items-end overflow-hidden border border-border bg-card p-3",
 slot.image_url && "bg-cover bg-center",
 )}
 style={
 slot.image_url
 ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15)), url(${slot.image_url})` }
 : undefined
 }
 >
 <div className="flex w-full items-center justify-between gap-2">
 <p className="truncate text-sm font-medium">
 {slot.title ?? "Featured creator"}
 </p>
 {slot.is_sponsored ? (
 <Badge variant="outline">Sponsored</Badge>
 ) : null}
 </div>
 </div>
 );

 if (slot.destination_url) {
 return (
 <Link
 key={slot.id}
 href={slot.destination_url}
 target="_blank"
 rel="noopener noreferrer"
 >
 {content}
 </Link>
 );
 }
 return <div key={slot.id}>{content}</div>;
 })}
 </div>
 );
}
