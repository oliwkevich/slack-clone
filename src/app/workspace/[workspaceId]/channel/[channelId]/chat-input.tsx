import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface Props {
	placeholder?: string;
}

type CreateMessageValues = {
	channelId: Id<'channels'>;
	workspaceId: Id<'workspaces'>;
	body: string;
	image?: Id<'_storage'> | undefined;
};

export const ChatInput = ({ placeholder }: Props) => {
	const [editorKey, setEditorKey] = useState(0);
	const [isPending, setIsPending] = useState(false);

	const channelId = useChannelId();
	const workspaceId = useWorkspaceId();
	const { generateUploadUrl } = useGenerateUploadUrl();

	const editorRef = useRef<Quill | null>(null);

	const { mutate: createMessage } = useCreateMessage();

	const handleSubmit = async ({
		body,
		image,
	}: {
		body: string;
		image: File | null;
	}) => {
		try {
			setIsPending(true);
			editorRef.current?.enable(false);

			const values: CreateMessageValues = {
				body,
				channelId,
				workspaceId,
				image: undefined,
			};

			if (image) {
				const url = await generateUploadUrl({}, { throwError: true });
				if (!url) throw Error('URL not found');

				const result = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': image.type },
					body: image,
				});

				if (!result.ok) throw Error('Failed to upload image');

				const { storageId } = await result.json();
				values.image = storageId;
			}

			createMessage(values, { throwError: true });
			setEditorKey(prev => prev + 1);
		} catch (error) {
			toast.error('Помилка при відправленні повідомлення!');
		} finally {
			setIsPending(false);
			editorRef.current?.enable(true);
		}
	};

	return (
		<div className='px-5 w-full'>
			<Editor
				key={editorKey}
				disabled={isPending}
				innerRef={editorRef}
				onSubmit={handleSubmit}
				placeholder={placeholder}
			/>
		</div>
	);
};
