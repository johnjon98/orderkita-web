import { LoadingSpinner } from '../feedback/LoadingSpinner'
import { Button, type ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean
  label: string
  loadingLabel?: string
}

export function SubmitButton({
  isLoading,
  label,
  loadingLabel,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingLabel ?? label}
        </>
      ) : (
        label
      )}
    </Button>
  )
}
