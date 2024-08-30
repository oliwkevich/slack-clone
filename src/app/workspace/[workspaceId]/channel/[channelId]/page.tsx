'use client';

import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useChannelId } from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import { Header } from './header';
import { ChatInput } from './chat-input';

const ChannelPage = () => {
	const channelId = useChannelId();

	const { data: channel, isLoading: isChannelLoading } = useGetChannel({
		id: channelId,
	});

	if (isChannelLoading) {
		return (
			<div className='h-full flex-1 flex items-center justify-center'>
				<Loader className='animate-spin size-5 text-muted-foreground' />
			</div>
		);
	}

	if (!channel) {
		return (
			<div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
				<TriangleAlert className='size-5 text-muted-foreground' />
				<span className='text-muted-foreground text-sm'>Канал не знайдено</span>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-full'>
			<Header title={channel.name} />
			<div className='flex-1' />
			<ChatInput placeholder={`Повідомленя для #${channel.name}`} />
		</div>
	);
};

export default ChannelPage;
