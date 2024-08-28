import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WorkspaceSwitcher = () => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [_, setOpen] = useCreateWorkspaceModal();

	const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
		id: workspaceId,
	});

	const filteredWorkspaces = workspaces?.filter(el => el?._id !== workspaceId);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className='size-9 relative overflow-hidden bg-[#ababab] hover:bg-[#ababab]/80 text-slate-800 font-semibold text-xl'>
					{workspaceLoading ? (
						<Loader className='size-5 animate-spin shrink-0' />
					) : (
						workspace?.name.charAt(0).toUpperCase()
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side='bottom' className='w-72' align='start'>
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className='cursor-pointer flex-col justify-start items-start capitalize'
				>
					{workspace?.name}
					<span className='text-xs text-muted-foreground'>Активний</span>
				</DropdownMenuItem>
				{filteredWorkspaces?.map(el => (
					<DropdownMenuItem
						key={el._id}
						className='cursor-pointer capitalize'
						onClick={() => router.push(`/workspace/${el._id}`)}
					>
						<div className='shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
							{el?.name.charAt(0).toUpperCase()}
						</div>
						<span className='truncate'>{el?.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem
					className='cursor-pointer'
					onClick={() => setOpen(true)}
				>
					<div className='size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
						<Plus />
					</div>
					Створити нове середовище
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
