import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { parseCSV } from '../../lib/data/csv';
import { useToast } from './useToast';
import { logger } from '../../lib/logger';
import type { Dataset as GenericDataset } from '../../types/data';

interface CSVUploaderProps {
  onDatasetLoaded: (dataset: GenericDataset) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDatasetLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileStats, setFileStats] = useState<{ rows: number; cols: number; size: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleProcessCSVContent = (content: string, fileName: string = 'Uploaded Dataset') => {
    try {
      if (!content.trim()) {
        toast.warning('File is empty', 'Please provide a valid CSV file with data.');
        return;
      }
      const dataset = parseCSV(content, fileName.replace(/\.[^/.]+$/, ''));
      onDatasetLoaded(dataset);
      setFileStats({
        rows: dataset.data.length,
        cols: dataset.columns.length,
        size: `${(content.length / 1024).toFixed(1)} KB`
      });
      setUploadedFileName(fileName);
      toast.success('CSV Uploaded Successfully', `Loaded ${dataset.data.length} rows & ${dataset.columns.length} columns.`);
      logger.info(`Successfully parsed uploaded CSV: ${fileName}`, { context: 'CSVUploader' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid CSV file format';
      toast.error('CSV Parsing Error', msg);
      logger.error('CSV upload parsing failed', err, { context: 'CSVUploader' });
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      toast.error('Invalid file type', 'Please upload a .csv file.');
      return;
    }

    readFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessCSVContent(text, file.name);
    };
    reader.onerror = () => {
      toast.error('File read error', 'Could not read the selected file.');
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!rawText.trim()) {
      toast.warning('Empty input', 'Please paste CSV content into the textarea.');
      return;
    }
    handleProcessCSVContent(rawText, 'Pasted Data');
  };

  const loadSample = (type: 'tech' | 'market') => {
    if (type === 'tech') {
      const csv = `Category,Adoption Rate\nSmartphones,92\nLaptops,78\nSmart Watches,55\nSmart Displays,34\nVR Headsets,18`;
      handleProcessCSVContent(csv, 'Smart Device Adoption');
    } else {
      const csv = `Region,Revenue\n"North America",420\n"Europe & UK",310\n"Asia Pacific",580\n"Latin America",140\n"Middle East",95`;
      handleProcessCSVContent(csv, 'Global Revenue Share');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200/60 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeMode === 'upload'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeMode === 'paste'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Paste CSV
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => loadSample('tech')}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sample 1
          </button>
          <button
            type="button"
            onClick={() => loadSample('market')}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sample 2
          </button>
        </div>
      </div>

      {activeMode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,text/csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-900 scale-[0.99]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drop your CSV
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Supports standard comma-separated tabular files
              </p>
            </div>
          </div>

          {/* Active File Feedback Banner */}
          {uploadedFileName && fileStats && (
            <div className="mt-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {uploadedFileName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {fileStats.rows} rows · {fileStats.cols} columns · {fileStats.size}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={'Category,Value\n"North America",420\n"Europe",310\n"Asia Pacific",580'}
            className="w-full p-3 text-xs font-mono rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 h-24 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all resize-none"
          />
          <button
            type="button"
            onClick={handlePasteSubmit}
            className="w-full py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Parse & Visualize
          </button>
        </div>
      )}
    </div>
  );
};
