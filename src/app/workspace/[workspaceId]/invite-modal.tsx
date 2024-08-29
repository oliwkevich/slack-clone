import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Copy, RefreshCcw } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	initialValue: string;
	joinCode: string;
	name: string;
};

export const InviteModal = ({
	initialValue,
	open,
	setOpen,
	joinCode,
	name,
}: Props) => {
	const [revalidateCount, setRevalidateCount] = useState(0);
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useNewJoinCode();

	const handleCopy = () => {
		const inviteLink = `${location.origin}/join/${workspaceId}`;
		navigator.clipboard
			.writeText(inviteLink)
			.then(() => toast.success('Запрошення успішно скопійовано'))
			.catch(() => toast.error('Помилка при копіюванні'));
	};

	const handleNewCode = () => {
		setRevalidateCount(prev => prev + 1);
		mutate(
			{ workspaceId },
			{
				onSuccess: () => toast.success('Код було ревалідовано'),
				onError: () => toast.error('Помилка при ревалідації'),
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Реферальне запрошення</DialogTitle>
					<DialogDescription>
						Використовуйте реферальний код, аби запросити людей до {name}
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col gap-y-4 items-center justify-center py-10'>
					<p className='text-4xl font-bold tracking-widest uppercase'>
						{joinCode}
					</p>
					<Button variant='ghost' size='sm' onClick={handleCopy}>
						<Copy className='size-4 mr-2' />
						Копіювати
					</Button>
				</div>
				<div className='flex items-center justify-between w-full'>
					<div className='flex flex-col relative'>
						<Button
							onClick={handleNewCode}
							variant='outline'
							disabled={isPending || revalidateCount > 2}
						>
							<RefreshCcw className='size-4 mr-2' />
							Ревалідувати код
						</Button>
						{revalidateCount > 2 && (
							<span className='text-xs absolute -bottom-5 left-1 truncate text-red-500'>
								Спробуйте пізніше
							</span>
						)}
					</div>
					<DialogClose asChild>
						<Button>Закрити</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
