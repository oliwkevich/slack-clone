import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef } from 'react';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface Props {
	placeholder?: string;
}

export const ChatInput = ({ placeholder }: Props) => {
	const editorRef = useRef<Quill | null>(null);

	const handleSubmit = ({
		body,
		image,
	}: {
		body: string;
		image: File | null;
	}) => {
		console.log({ body, image });
	};

	return (
		<div className='px-5 w-full'>
			<Editor
				disabled={false}
				innerRef={editorRef}
				onSubmit={handleSubmit}
				placeholder={placeholder}
			/>
		</div>
	);
};
