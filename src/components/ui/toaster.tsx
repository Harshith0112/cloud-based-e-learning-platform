import * as React from "react"
import { Toast as ToastPrimitive } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastPrimitive.Provider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastPrimitive key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastPrimitive.Title>{title}</ToastPrimitive.Title>}
              {description && (
                <ToastPrimitive.Description>{description}</ToastPrimitive.Description>
              )}
            </div>
            {action}
            <ToastPrimitive.Close />
          </ToastPrimitive>
        )
      })}
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}
