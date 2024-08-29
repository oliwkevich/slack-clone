import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sidebarItemsVariants = cva(
	'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
	{
		variants: {
			variant: {
				default: 'text-[#f9edffcc]',
				active: 'text-[#481349] bg-white/90 hover:bg-white/90',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

type Props = {
	id: string;
	icon: LucideIcon | IconType;
	label: string;
	variant?: VariantProps<typeof sidebarItemsVariants>['variant'];
};

export const SidebarItem = ({ icon: Icon, id, label, variant }: Props) => {
	const workspaceId = useWorkspaceId();

	return (
		<Button
			variant='transparent'
			size='sm'
			asChild
			className={cn(sidebarItemsVariants({ variant }))}
		>
			<Link href={`/workspace/${workspaceId}/channel/${id}`}>
				<Icon className='size-3.5 mr-1 shrink-0' />
				<span className='text-sm truncate'>{label}</span>
			</Link>
		</Button>
	);
};
