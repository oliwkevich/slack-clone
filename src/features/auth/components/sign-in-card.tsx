import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { SignInFlow } from '../types';
import { TriangleAlert } from 'lucide-react';

interface Props {
	setState: Dispatch<SetStateAction<SignInFlow>>;
}

export const SignInCard = ({ setState }: Props) => {
	const { signIn } = useAuthActions();

	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [pending, setPending] = useState(false);

	const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPending(true);

		signIn('password', { email, password, flow: 'signIn' })
			.catch(() => setError('Неправильний логін або пароль!'))
			.finally(() => setPending(false));
	};

	const handleProviderSignIn = (value: 'github' | 'google') => {
		setPending(true);
		signIn(value).finally(() => setPending(false));
	};

	return (
		<Card className='w-full h-full p-8'>
			<CardHeader className='px-0 pt-0'>
				<CardTitle>Авторизація</CardTitle>
				<CardDescription>
					Використовуйте ваш email або інший сервіс щоб продовжити
				</CardDescription>
			</CardHeader>
			{!!error && (
				<div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
					<TriangleAlert className='size-4' />
					<p>{error}</p>
				</div>
			)}
			<CardContent className='space-y-5 px-0 pb-0'>
				<form className='space-y-2.5' onSubmit={onPasswordSignIn}>
					<Input
						placeholder='example@mail.com'
						disabled={pending}
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						type='email'
					/>
					<Input
						placeholder='************'
						disabled={pending}
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						type='password'
					/>
					<Button type='submit' className='w-full' size='lg' disabled={pending}>
						Увійти
					</Button>
				</form>
				<Separator />
				<div className='flex flex-col gap-y-2.5'>
					<Button
						className='w-full relative'
						disabled={pending}
						onClick={() => handleProviderSignIn('google')}
						variant='outline'
						size='lg'
					>
						<FcGoogle className='size-5 absolute top-2.5 left-2.5' />
						Увійти через Google
					</Button>
					<Button
						className='w-full relative'
						disabled={pending}
						onClick={() => handleProviderSignIn('github')}
						variant='outline'
						size='lg'
					>
						<FaGithub className='size-5 absolute top-3 left-3' />
						Увійти через GitHub
					</Button>
				</div>
				<p className='text-xs text-muted-foreground'>
					Ще немає акаунту?{' '}
					<span
						onClick={() => setState('signUp')}
						className='text-sky-700 cursor-pointer hover:underline'
					>
						Створити
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
