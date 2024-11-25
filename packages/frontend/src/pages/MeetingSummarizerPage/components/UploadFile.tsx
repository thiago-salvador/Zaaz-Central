import React, { useCallback, useRef, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack,
  IconButton,
  useTheme,
  Fade,
  LinearProgress,
  Tooltip,
  Chip
} from '@mui/material';
import { FiUpload, FiMic, FiFile, FiCheckCircle } from 'react-icons/fi';
import { styled } from '@mui/material/styles';

interface UploadFileProps {
  onFileUpload: (file: File) => void;
  isRecording: boolean;
  onRecordingToggle: () => void;
}

const UploadPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: 'var(--card-background)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'var(--primary-color)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px var(--shadow-color)',
  },
}));

const RecordButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'var(--primary-hover)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px var(--shadow-color)',
  },
}));

const ACCEPTED_FILE_TYPES = {
  audio: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.oasis.opendocument.text',
    'application/rtf'
  ]
};

const FILE_TYPE_LABELS = {
  'audio/mp3': 'Audio',
  'audio/wav': 'Audio',
  'audio/mpeg': 'Audio',
  'audio/m4a': 'Audio',
  'video/mp4': 'Video',
  'video/webm': 'Video',
  'video/quicktime': 'Video',
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'text/plain': 'Text',
  'application/vnd.oasis.opendocument.text': 'Document',
  'application/rtf': 'RTF'
};

const UploadFile: React.FC<UploadFileProps> = ({ 
  onFileUpload, 
  isRecording, 
  onRecordingToggle 
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const isValidFileType = (file: File) => {
    return [
      ...ACCEPTED_FILE_TYPES.audio, 
      ...ACCEPTED_FILE_TYPES.video,
      ...ACCEPTED_FILE_TYPES.document
    ].includes(file.type);
  };

  const getFileTypeLabel = (file: File) => {
    return FILE_TYPE_LABELS[file.type as keyof typeof FILE_TYPE_LABELS] || 'File';
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      setUploadProgress(0);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      
      onFileUpload(file);
      setUploadProgress(null);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Box sx={{ height: '100%', animation: 'fadeIn 0.3s ease-out' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".mp3,.wav,.m4a,.mp4,.webm,.mov,.pdf,.doc,.docx,.txt,.odt,.rtf"
      />
      
      <UploadPaper
        elevation={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        sx={{
          border: isDragging ? '2px dashed var(--primary-color)' : undefined,
          backgroundColor: isDragging ? 'var(--primary-light)' : undefined,
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: 'var(--text-primary)',
          }}
        >
          {uploadedFile ? (
            <>
              <FiCheckCircle size={48} color="var(--success-color)" />
              <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
                {uploadedFile.name}
              </Typography>
              <Chip
                label={`${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`}
                sx={{
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--text-secondary)',
                }}
              />
            </>
          ) : (
            <>
              <FiUpload size={48} color="var(--primary-color)" />
              <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
                Drag and drop your file here
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                or click to select a file
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<FiFile />}
                  sx={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    '&:hover': {
                      borderColor: 'var(--primary-color)',
                      backgroundColor: 'var(--primary-light)',
                    },
                  }}
                >
                  Choose File
                </Button>
                <RecordButton
                  variant="contained"
                  onClick={onRecordingToggle}
                  startIcon={<FiMic />}
                  color={isRecording ? 'error' : 'primary'}
                >
                  {isRecording ? 'Stop Recording' : 'Record Audio'}
                </RecordButton>
              </Stack>
            </>
          )}
          
          {uploadProgress !== null && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  backgroundColor: 'var(--background-secondary)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'var(--primary-color)',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </UploadPaper>
    </Box>
  );
};

export default UploadFile;
