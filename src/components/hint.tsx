'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface Props {
	label: string;
	children: React.ReactNode;
	side?: 'left' | 'right' | 'top' | 'bottom';
	align?: 'start' | 'center' | 'end';
}

export const Hint = ({ children, label, side = 'bottom', align }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					align={align}
					className='bg-black text-white border border-white/5'
				>
					<p className='font-medium text-xs'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
