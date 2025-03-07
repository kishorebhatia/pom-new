import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalyzePage from './pages/AnalyzePage';
import GeneratePage from './pages/GeneratePage';
import PreviewPage from './pages/PreviewPage';
import ExportPage from './pages/ExportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="generate" element={<GeneratePage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="export" element={<ExportPage />} />
      </Route>
    </Routes>
  );
}

export default App; 