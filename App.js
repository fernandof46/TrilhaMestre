import { Routes, Route } from 'react-router';
import Index from '@/pages/Index';
import RoadmapView from '@/pages/RoadmapView';

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Index />} />
			<Route path="/roadmap" element={<RoadmapView />} />
		</Routes>
	);
}
