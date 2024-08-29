'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useJoin } from '@/features/workspaces/api/use-join';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

const JoinPage = () => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();

	const { mutate, isPending } = useJoin();
	const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

	const isMember = useMemo(() => data?.isMember, [data?.isMember]);

	useEffect(() => {
		if (isMember) {
			router.replace(`/workspace/${workspaceId}`);
			toast.warning(`Ви вже є членом ${data?.name}`);
		}
	}, [isMember, router]);

	const handleComplete = (joinCode: string) => {
		mutate(
			{ workspaceId, joinCode },
			{
				onSuccess: id => {
					router.replace(`/workspace/${id}`);
					toast.success(`Вітаємо в ${data?.name}`);
				},
				onError: () => {
					toast.error(`Невірний код для ${data?.name}!`);
				},
			}
		);
	};

	if (isLoading) {
		return (
			<div className='flex flex-col h-full items-center justify-center gap-y-8'>
				<Skeleton className='w-[60px] h-[60px]' />
				<div className='flex justify-center gap-2 flex-col items-center'>
					<Skeleton className='w-[260px] h-[30px]' />
					<Skeleton className='w-[120px] h-[30px]' />
				</div>
				<Skeleton className='w-[320px] h-[80px]' />
				<Skeleton className='w-[180px] h-[50px]' />
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
			<Image src='/logo.png' width={60} height={60} alt='logo' />
			<div className='flex flex-col gap-y-4 items-center justify-center max-w-md'>
				<div className='flex flex-col gap-y-2 items-center justify-center'>
					<h1 className='text-2xl font-bold'>Приєднатись до {data?.name}</h1>
					<p className='text-muted-foreground text-base'>
						Уведіть код запрошення для продовження
					</p>
				</div>
				<VerificationInput
					classNames={{
						container: cn(
							'flex gap-x-2',
							isPending && 'opacity-50 cursor-not-allowed'
						),
						character:
							'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
						characterInactive: 'bg-muted',
						characterSelected: 'bg-white text-black',
						characterFilled: 'bg-white text-black',
					}}
					onComplete={handleComplete}
					autoFocus
					length={6}
				/>
			</div>
			<div className='flex gap-x-4'>
				<Button size='lg' variant='outline' asChild>
					<Link href='/'>Повернутись на головну</Link>
				</Button>
			</div>
		</div>
	);
};

export default JoinPage;
