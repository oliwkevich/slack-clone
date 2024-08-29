import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
	AlertTriangle,
	HashIcon,
	Loader,
	MessageSquareText,
	SendHorizonal,
} from 'lucide-react';
import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';
import { WorkspaceSection } from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { UserItem } from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useGetChannels } from '@/features/channels/api/use-get-channels';

export const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId();

	const [_, setOpenCreateChannel] = useCreateChannelModal();

	const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
		workspaceId,
	});

	const { data: member, isLoading: isLoadingMember } = useCurrentMember({
		workspaceId,
	});
	const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
		id: workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
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
			<div className='flex flex-col px-2 mt-3'>
				<SidebarItem label='Треди' icon={MessageSquareText} id='threads' />
				<SidebarItem label='Чорновики' icon={SendHorizonal} id='drafts' />
			</div>
			<WorkspaceSection
				label='Канали'
				hint='Новий канал'
				onNew={
					member.role === 'admin' ? () => setOpenCreateChannel(true) : undefined
				}
			>
				{channels?.map(item => (
					<SidebarItem
						id={item._id}
						key={item._id}
						icon={HashIcon}
						label={item.name}
					/>
				))}
			</WorkspaceSection>
			<WorkspaceSection
				label='Приватні'
				hint='Нове повідомлення'
				onNew={() => {}}
			>
				{members?.map(item => (
					<UserItem
						label={item.user.name}
						id={item._id}
						key={item._id}
						image={item.user.image}
					/>
				))}
			</WorkspaceSection>
		</div>
	);
};
