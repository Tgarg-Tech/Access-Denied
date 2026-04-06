import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Upload, FileText, Award, Link2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SkillVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillVerificationModal({ isOpen, onClose }: SkillVerificationModalProps) {
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handlePortfolioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setPortfolioFile(files[0]);
    }
  };

  const handleCertificateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setCertificateFiles([...certificateFiles, ...files]);
  };

  const handleSubmit = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F8FAFC]/95 dark:bg-[#0B1020]/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#F8FAFC]/90 dark:bg-[#0B1020]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Verify Your Skills
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                Build trust with verified credentials
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#121A2B] transition-colors"
            >
              <X className="w-6 h-6 text-[#64748B] dark:text-[#94A3B8]" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                <Github className="w-5 h-5 mr-2 text-violet-500" />
                GitHub Profile
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#64748B] dark:placeholder-[#94A3B8] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
                We'll verify your contributions and repositories
              </p>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                <Link2 className="w-5 h-5 mr-2 text-blue-500" />
                LinkedIn Profile
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#64748B] dark:placeholder-[#94A3B8] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Resume / Portfolio
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handlePortfolioDrop}
                className={`relative rounded-xl border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B]'
                }`}
              >
                <input
                  type="file"
                  id="portfolio"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setPortfolioFile(files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-8 text-center">
                  {portfolioFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">
                        {portfolioFile.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPortfolioFile(null);
                        }}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-[#64748B] dark:text-[#94A3B8]" />
                      <p className="text-[#0F172A] dark:text-[#F8FAFC] font-medium mb-1">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                        PDF, DOC, or DOCX (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                <Award className="w-5 h-5 mr-2 text-orange-500" />
                Certificates (Optional)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleCertificateDrop}
                className={`relative rounded-xl border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#121A2B]'
                }`}
              >
                <input
                  type="file"
                  id="certificates"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setCertificateFiles([...certificateFiles, ...Array.from(files)]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-8 text-center">
                  {certificateFiles.length > 0 ? (
                    <div className="space-y-2">
                      {certificateFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1020]"
                        >
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCertificateFiles(
                                certificateFiles.filter((_, i) => i !== index)
                              );
                            }}
                            className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-[#64748B] dark:text-[#94A3B8]" />
                      <p className="text-[#0F172A] dark:text-[#F8FAFC] font-medium mb-1">
                        Drop certificates here or click to browse
                      </p>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                        PDF, JPG, or PNG (Multiple files allowed)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Your verification will be reviewed within 24 hours. Verified profiles get
                higher visibility in team matching.
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 flex gap-4 p-6 bg-[#F8FAFC]/90 dark:bg-[#0B1020]/90 backdrop-blur-md border-t border-black/10 dark:border-white/10">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] font-semibold hover:border-violet-500 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              Submit for Verification
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
