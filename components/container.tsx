import { cn } from "@/lib/utils";

interface ContainerProps {
  /** The content to be displayed inside the container. */
  children: React.ReactNode;
  /** Additional class names to customize the container's styling. */
  className?: string;
  /** The size of the container. Defaults to "default". */
  size?: "default" | "prose" | "full";
}

/**
 * A reusable container component that provides consistent styling and layout.
 *
 * @param {ContainerProps} props - The props for the container component.
 * @returns {JSX.Element} A styled container element wrapping the provided children.
 *
 * @example
 * <Container size="prose" className="custom-class">
 *   <p>Your content here</p>
 * </Container>
 */
export function Container({
  children,
  className,
  size = "default",
}: ContainerProps): React.JSX.Element {
  const maxWidths = {
    default: "max-w-5xl",
    prose: "max-w-3xl", // Plus étroit, parfait pour la lecture d'articles
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto w-full px-6", maxWidths[size], className)}>
      {children}
    </div>
  );
}
