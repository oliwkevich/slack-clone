'use client';

import { Toolbar } from './toolbar';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Toolbar />
			{children}
		</div>
	);
};

export default WorkspaceLayout;
