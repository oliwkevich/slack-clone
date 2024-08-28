import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, Loader } from 'lucide-react';
import { WorkspaceHeader } from './workspace-header';

export const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId();

	const { data: member, isLoading: isLoadingMember } = useCurrentMember({
		workspaceId,
	});
	const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
		id: workspaceId,
	});

	if (isLoadingMember || isLoadingWorkspace) {
		return (
			<div className='flex bg-[#5e2c5f] h-full items-center justify-center'>
				<Loader className='animate-spin size-5 text-white' />
			</div>
		);
	}

	if (!workspace || !member) {
		return (
			<div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
				<AlertTriangle className='size-5 text-white' />
				<p className='text-white text-sm'>Не знайдено даних</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col bg-[#5e2c5f] h-full'>
			<WorkspaceHeader
				workspace={workspace}
				isAdmin={member.role === 'admin'}
			/>
		</div>
	);
};
