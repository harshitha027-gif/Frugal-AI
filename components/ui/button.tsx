import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const styles: Record<string, string> = {
        primary: 'btn btn-primary',
        secondary: 'btn btn-secondary',
        outline: 'btn btn-outline',
        ghost: 'btn btn-ghost',
    }

    const sizes: Record<string, string> = {
        sm: '',
        md: '',
        lg: 'btn-lg',
    }

    return (
        <button
            className={cn(styles[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    )
}
