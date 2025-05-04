import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

export function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  src,
  alt = "User avatar",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [isLoaded, setIsLoaded] = React.useState(true)

  return isLoaded && src ? (
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      data-slot="avatar-image"
      onError={() => setIsLoaded(false)}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  ) : (
    <AvatarFallback />
  )
}

export function AvatarFallback({
  className,
  children = "👤", // Default fallback (emoji or initials)
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full text-sm", className)}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}
