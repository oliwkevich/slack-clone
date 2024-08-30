import { usePaginatedQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface Props {
	channelId?: Id<'channels'>;
	parentMessageId?: Id<'messages'>;
	conversationId?: Id<'conversations'>;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType;

const BATCH_SIZE = 20;

export const useGetMessages = ({
	channelId,
	conversationId,
	parentMessageId
}: Props) => {
	const { results, status, loadMore } = usePaginatedQuery(
		api.messages.get,
		{
			channelId,
			conversationId,
			parentMessageId
		},
		{ initialNumItems: BATCH_SIZE }
	);

	return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
