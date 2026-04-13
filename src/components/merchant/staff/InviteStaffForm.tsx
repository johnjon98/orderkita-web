'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/common/forms/FormField'
import { SubmitButton } from '@/components/common/forms/SubmitButton'
import { merchantsApi } from '@/lib/api/merchants'
import { toast } from 'sonner'

const schema = z.object({
  email:     z.string().email('Invalid email'),
  full_name: z.string().min(2, 'Name is required'),
  role:      z.enum(['merchant_staff', 'kitchen_staff']),
})

type FormData = z.infer<typeof schema>

interface InviteStaffFormProps {
  onSuccess: () => void
}

export function InviteStaffForm({ onSuccess }: InviteStaffFormProps) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'merchant_staff' },
  })

  async function onSubmit(data: FormData) {
    try {
      await merchantsApi.inviteStaff(data)
      toast.success(`Invitation sent to ${data.email}`)
      onSuccess()
    } catch {
      toast.error('Failed to send invitation')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input id="email" type="email" {...register('email')} placeholder="staff@example.com" />
      </FormField>

      <FormField label="Full name" htmlFor="full_name" error={errors.full_name?.message} required>
        <Input id="full_name" {...register('full_name')} placeholder="Ahmad bin Ali" />
      </FormField>

      <FormField label="Role" error={errors.role?.message} required>
        <Select defaultValue="merchant_staff" onValueChange={(v) => setValue('role', v as FormData['role'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="merchant_staff">Counter Staff</SelectItem>
            <SelectItem value="kitchen_staff">Kitchen Staff</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <SubmitButton isLoading={isSubmitting} label="Send invitation" className="w-full" />
    </form>
  )
}
