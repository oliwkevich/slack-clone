import { Doc, Id } from '../../convex/_generated/dataModel';

type Props = {
	id: Id<'messages'>;
	memberId: Id<'members'>;
	authorMessage?: string;
	authorImage?: string;
	isAuthor: boolean;
	reactions: Omit<Doc<'reactions'>, 'memberId'> & {
		count: number;
		memberIds: Id<'members'>[];
	};
	body: Doc<'messages'>['body'];
	image: string | null | undefined;
	createdAt: Doc<'messages'>['_creationTime'];
	updatedAt: Doc<'messages'>['updatedAt'];
	isEdditing: boolean;
	isCompact?: boolean;
	setEditingId: (id: Id<'messages'> | null) => void;
	threadCount?: number;
	threadImage?: string;
	threadTimestamp?: number;
	hideThreadButton?: boolean;
};

export const Message = (props: Props) => {
	return <div>Message</div>;
};
