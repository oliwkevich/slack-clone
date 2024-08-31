import { format, isToday, isYesterday } from 'date-fns';

import { GetMessagesReturnType } from '@/features/messages/api/use-get-messages';

import { Message } from './message';

interface Props {
	data: GetMessagesReturnType;
	loadMore: () => void;
	isLoadingMore: boolean;
	canLoadMore: boolean;
	channelName?: string;
	channelCreationTime?: number;
	memberName?: string;
	memberImage?: string;
	variant?: 'channel' | 'thread' | 'conversation';
}

const formatDateLabel = (dateKey: string) => {
	const date = new Date(dateKey);
	if (isToday(date)) return 'Сьогодні';
	if (isYesterday(date)) return 'Вчора';

	return format(date, 'EEEE, MMMM dd');
};

//https://youtu.be/AbztO-X7PCQ?t=7694

export const MessageList = ({
	canLoadMore,
	data,
	isLoadingMore,
	loadMore,
	channelCreationTime,
	channelName,
	memberImage,
	memberName,
	variant = 'channel'
}: Props) => {
	const groupedMessages = (data || []).reduce(
		(groups, message) => {
			const date = new Date(message!._creationTime);
			const dateKey = format(date, 'yyyy-MM-dd');
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}

			groups[dateKey].unshift(message);
			return groups;
		},
		{} as Record<string, any>
	);

	if (!groupedMessages) return null;

	return (
		<div className='flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar'>
			{Object.entries(groupedMessages || {}).map(([dataKey, messages]) => (
				<div key={dataKey}>
					<div className='text-center my-2 relative'>
						<hr className='absolute top-3.5 left-0 right-0 border-t border-gray-300' />
						<span className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
							{formatDateLabel(dataKey)}
						</span>
					</div>
					{messages.map((message) => (
						<Message
							key={message?._id}
							id={message._id}
							memberId={message?.memberId}
							authorMessage={message?.user.name}
							authorImage={message?.user.image}
							isAuthor={false}
							reactions={message?.reactions}
							body={message?.body}
							image={message?.image}
							updatedAt={message?.updatedAt}
							createdAt={message?._creationTime}
							threadCount={message?.threadCount}
							threadImage={message?.threadImage}
							threadTimestamp={message?.threadTimestamp}
							isEdditing={false}
							setEditingId={() => {}}
							isCompact={false}
							hideThreadButton={false}
						/>
					))}
				</div>
			))}
		</div>
	);
};
