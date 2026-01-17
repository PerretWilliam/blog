"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sizeLabels } from "@/constant/size";
import { Locale } from "@/dictionaries/dictionaries";

/**
 * A component that renders a size selector dropdown menu.
 * Allows users to select a size option, which updates the URL query parameter.
 *
 * @param {Object} props - The props object.
 * @param {Locale} props.lang - The current language/locale used for displaying size labels.
 * @returns {JSX.Element} The rendered SizeSelector component.
 */
export function SizeSelector({ lang }: { lang: Locale }): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the current size from the URL query parameters, defaulting to "base" if not set.
  const currentSize = searchParams.get("size") || "base";

  /**
   * Handles the size change event by updating the "size" query parameter in the URL.
   *
   * @param {string} newSize - The new size value selected by the user.
   */
  const handleSizeChange = (newSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newSize);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Label for the size selector */}
      <span className="text-sm font-medium">{sizeLabels[lang]["text"]}</span>
      <Select
        value={currentSize}
        onValueChange={(value) => handleSizeChange(value as string)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Taille">
            {sizeLabels[lang][currentSize]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Size options */}
          <SelectItem value="sm">{sizeLabels[lang]["sm"]}</SelectItem>
          <SelectItem value="base">{sizeLabels[lang]["base"]}</SelectItem>
          <SelectItem value="lg">{sizeLabels[lang]["lg"]}</SelectItem>
          <SelectItem value="xl">{sizeLabels[lang]["xl"]}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
