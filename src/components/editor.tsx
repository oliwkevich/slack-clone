import Quill, { type QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';
import {
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import { Button } from './ui/button';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { Hint } from './hint';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';
import { EmojiPopover } from './emoji-popover';
import Image from 'next/image';

type EditorValue = {
	image: File | null;
	body: string;
};

interface Props {
	onSubmit: ({ image, body }: EditorValue) => void;
	onCancel?: () => void;
	placeholder?: string;
	defaultValue?: Delta | Op[];
	disabled?: boolean;
	innerRef?: MutableRefObject<Quill | null>;
	variant?: 'create' | 'update';
}

const Editor = ({
	onSubmit,
	innerRef,
	onCancel,
	disabled = false,
	defaultValue = [],
	variant = 'create',
	placeholder = 'Почніть вводити текст...',
}: Props) => {
	const [text, setText] = useState('');
	const [image, setImage] = useState<File | null>(null);

	const submitRef = useRef(onSubmit);
	const disabledRef = useRef(disabled);
	const palceholderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const defaultValueRef = useRef(defaultValue);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageElementRef = useRef<HTMLInputElement>(null);

	useLayoutEffect(() => {
		submitRef.current = onSubmit;
		disabledRef.current = disabled;
		palceholderRef.current = placeholder;
		defaultValueRef.current = defaultValue;
	});

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const editorContainer = container.appendChild(
			container.ownerDocument.createElement('div')
		);

		const options: QuillOptions = {
			theme: 'snow',
			placeholder: palceholderRef.current,
			modules: {
				keyboard: {
					bindings: {
						enter: {
							key: 'Enter',
							handler: () => {
								const text = quill.getText();
								const addedImage = imageElementRef.current?.files?.[0] || null;

								const isEmpty =
									!addedImage &&
									text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

								if (isEmpty) return;

								const body = JSON.stringify(quill.getContents());
								submitRef.current?.({ body, image: addedImage });
								return;
							},
						},
						shift_enter: {
							key: 'Enter',
							shiftKey: true,
							handler: () => {
								quill.insertText(quill.getSelection()?.index || 0, '\n');
							},
						},
					},
				},
				toolbar: [
					['bold', 'italic', 'strike'],
					['link'],
					[{ list: 'ordered' }, { list: 'bullet' }],
				],
			},
		};

		const quill = new Quill(editorContainer, options);
		quillRef.current = quill;
		quillRef.current.focus();

		if (innerRef) innerRef.current = quill;

		quill.setContents(defaultValueRef.current);
		setText(quill.getText());

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText());
		});

		return () => {
			quill.off(Quill.events.TEXT_CHANGE);

			if (container) container.innerHTML = '';
			if (quillRef.current) quillRef.current = null;
			if (innerRef) innerRef.current = null;
		};
	}, [innerRef]);

	const toggleToolbar = () => {
		const toolbarElement = containerRef?.current?.querySelector('.ql-toolbar');

		if (!toolbarElement) return;
		toolbarElement.classList.toggle('hidden');
	};

	const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

	const handleEmojiSelect = (emoji: any) => {
		const quill = quillRef.current;
		quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
	};

	return (
		<div className='flex flex-col'>
			<input
				hidden
				type='file'
				accept='image'
				ref={imageElementRef}
				onChange={e => setImage(e.target.files![0])}
			/>
			<div
				className={cn(
					'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
					disabled && 'opacity-50'
				)}
			>
				<div ref={containerRef} className='h-full ql-custom' />
				{!!image && (
					<div className='p-2'>
						<div className='relative size-[62px] flex items-center justify-center group/image'>
							<Hint label='Видалити' side='top'>
								<button
									onClick={() => {
										setImage(null);
										imageElementRef.current!.value = '';
									}}
									className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center'
								>
									<XIcon className='size-3.5' />
								</button>
							</Hint>
							<Image
								src={URL.createObjectURL(image)}
								alt='uploaded'
								fill
								className='rounded-xl overflow-hidden border object-cover'
							/>
						</div>
					</div>
				)}
				<div className='flex px-2 pb-2 z-[5]'>
					<Hint label='Форматування'>
						<Button
							disabled={disabled}
							size='iconSm'
							variant='ghost'
							onClick={toggleToolbar}
						>
							<PiTextAa className='size-4' />
						</Button>
					</Hint>
					<EmojiPopover onEmojiSelect={handleEmojiSelect}>
						<Button disabled={disabled} size='iconSm' variant='ghost'>
							<Smile className='size-4' />
						</Button>
					</EmojiPopover>
					{variant === 'update' && (
						<div className='ml-auto flex items-center gap-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={onCancel}
								disabled={disabled}
							>
								Відмінити
							</Button>
							<Button
								size='sm'
								onClick={() =>
									onSubmit({
										image,
										body: JSON.stringify(quillRef.current?.getContents()),
									})
								}
								disabled={disabled || isEmpty}
								className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
							>
								Зберегти
							</Button>
						</div>
					)}
					{variant === 'create' && (
						<>
							<Hint label='Зображення'>
								<Button
									disabled={disabled}
									size='iconSm'
									variant='ghost'
									onClick={() => imageElementRef.current?.click()}
								>
									<ImageIcon className='size-4' />
								</Button>
							</Hint>
							<Button
								disabled={disabled || isEmpty}
								size='iconSm'
								onClick={() =>
									onSubmit({
										image,
										body: JSON.stringify(quillRef.current?.getContents()),
									})
								}
								className={cn(
									'ml-auto',
									isEmpty
										? 'bg-white hover:bg-white text-muted-foreground'
										: 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
								)}
							>
								<MdSend className='size-4' />
							</Button>
						</>
					)}
				</div>
			</div>
			{variant === 'create' && (
				<div
					className={cn(
						'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
						!isEmpty && 'opacity-100'
					)}
				>
					<p className=''>
						<strong>Shift + Return</strong> наступний рядок
					</p>
				</div>
			)}
		</div>
	);
};

export default Editor;
