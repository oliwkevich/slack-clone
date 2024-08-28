'use client';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sidebar } from './sidebar';
import { Toolbar } from './toolbar';
import { WorkspaceSidebar } from './workspace-sidebar';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Toolbar />
			<div className='flex h-[calc(100vh-40px)]'>
				<Sidebar />
				<ResizablePanelGroup
					direction='horizontal'
					autoSaveId='workspace-layout'
				>
					<ResizablePanel defaultSize={15} minSize={5} className='bg-[#5e2c5f]'>
						<WorkspaceSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={80}>{children}</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default WorkspaceLayout;
