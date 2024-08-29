'use client';

import { CreateChannelModal } from '@/features/channels/components/create-channel-modal';
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';
import { useEffect, useState } from 'react';

export const Modals = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => setIsClient(true), []);
	if (!isClient) return;

	return (
		<>
			<CreateWorkspaceModal />
			<CreateChannelModal />
		</>
	);
};
