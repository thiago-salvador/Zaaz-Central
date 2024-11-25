import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiUpload, FiMic, FiSearch, FiDownload, FiShare2, FiEye, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from 'react-icons/bs';
import { recordingService } from '../../services/recordingService';
import { transcribeFile, transcribeAudio } from '../../services/transcriptionService';
import Notification, { NotificationType } from '../../components/Notification/Notification';
import styles from './MeetingSummarizer.module.css';

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'processed' | 'pending' | 'failed';
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
}

interface NotificationState {
  type: NotificationType;
  message: string;
}

const MeetingSummarizer: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const stats = {
    totalMeetings: meetings.length,
    processedMeetings: meetings.filter(m => m.status === 'processed').length,
    pendingMeetings: meetings.filter(m => m.status === 'pending').length,
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    for (const file of fileArray) {
      const newMeeting: Meeting = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toISOString(),
        duration: "00:00",
        status: 'pending',
        keyPoints: [],
        sentiment: 'neutral',
        confidenceScore: 0,
      };

      setMeetings(prev => [...prev, newMeeting]);
      showNotification('info', `Processing ${file.name}...`);

      try {
        const result = await transcribeFile(file);
        
        setMeetings(prev => prev.map(meeting => 
          meeting.id === newMeeting.id 
            ? {
                ...meeting,
                status: 'processed',
                duration: result.meeting.duration,
                keyPoints: result.summary.keyPoints,
                sentiment: result.summary.sentimentAnalysis.overall.toLowerCase() as 'positive' | 'neutral' | 'negative',
                confidenceScore: result.summary.confidenceScore,
              }
            : meeting
        ));
        showNotification('success', `Successfully processed ${file.name}`);
      } catch (error) {
        console.error('Error processing file:', error);
        setMeetings(prev => prev.map(meeting => 
          meeting.id === newMeeting.id 
            ? { ...meeting, status: 'failed' }
            : meeting
        ));
        showNotification('error', `Failed to process ${file.name}`);
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const audioBlob = await recordingService.stopRecording();
        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        const result = await transcribeAudio(audioBlob);
        
        const newMeeting: Meeting = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Recording ${new Date().toLocaleString()}`,
          date: new Date().toISOString(),
          duration: result.meeting.duration,
          status: 'processed',
          keyPoints: result.summary.keyPoints,
          sentiment: result.summary.sentimentAnalysis.overall.toLowerCase() as 'positive' | 'neutral' | 'negative',
          confidenceScore: result.summary.confidenceScore,
        };
        
        setMeetings(prev => [...prev, newMeeting]);
        showNotification('success', 'Recording processed successfully');
      } else {
        await recordingService.startRecording();
        showNotification('info', 'Recording started');
      }
      setIsRecording(!isRecording);
    } catch (error) {
      console.error('Error toggling recording:', error);
      showNotification('error', 'Failed to toggle recording');
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSentimentIcon = (sentiment: Meeting['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <BsEmojiSmile className={styles.sentimentPositive} />;
      case 'neutral':
        return <BsEmojiNeutral className={styles.sentimentNeutral} />;
      case 'negative':
        return <BsEmojiFrown className={styles.sentimentNegative} />;
    }
  };

  const getStatusClass = (status: Meeting['status']) => {
    switch (status) {
      case 'processed':
        return styles.statusProcessed;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className={styles.header}>
        <h1 className={styles.title}>Meeting Summarizer</h1>
        <p className={styles.description}>
          Transform your meetings into actionable insights with AI-powered summaries, key points, and sentiment analysis
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Meetings</span>
            <FiClock size={24} />
          </div>
          <div className={styles.statValue}>{stats.totalMeetings}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Processed</span>
            <FiCheckCircle size={24} color="#34c759" />
          </div>
          <div className={styles.statValue}>{stats.processedMeetings}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Pending</span>
            <FiAlertCircle size={24} color="#ff9500" />
          </div>
          <div className={styles.statValue}>{stats.pendingMeetings}</div>
        </div>
      </div>

      <div className={`${styles.uploadSection} ${dragActive ? styles.dragActive : ''}`}
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}>
        <FiUpload className={styles.uploadIcon} size={48} />
        <h2 className={styles.uploadTitle}>Upload Meeting Recording</h2>
        <p className={styles.uploadDescription}>
          Drag and drop your audio file here, or click to select a file. 
          Supported formats: MP3, WAV, M4A (up to 100MB)
        </p>
        <div className={styles.uploadActions}>
          <button className={styles.primaryButton} onClick={() => fileInputRef.current?.click()}>
            <FiUpload size={20} />
            Select File
          </button>
          <button 
            className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
            onClick={toggleRecording}
          >
            <FiMic size={20} />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            style={{ display: 'none' }}
            accept=".mp3,.wav,.m4a"
          />
        </div>
      </div>

      <div className={styles.meetingsList}>
        {meetings.map((meeting) => (
          <div key={meeting.id} className={styles.meetingCard}>
            <div className={styles.meetingHeader}>
              <h3 className={styles.meetingTitle}>{meeting.title}</h3>
              <span className={styles.meetingDate}>
                {new Date(meeting.date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles[`status${meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}`]}>
              {meeting.status === 'processed' && <FiCheckCircle size={16} />}
              {meeting.status === 'pending' && <FiClock size={16} />}
              {meeting.status === 'failed' && <FiAlertCircle size={16} />}
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </div>
            <div className={styles.meetingMeta}>
              <span className={styles.metaItem}>
                <FiClock size={16} />
                {meeting.duration}
              </span>
              <span className={styles.metaItem}>
                {meeting.sentiment === 'positive' && <BsEmojiSmile className={styles.sentimentPositive} size={16} />}
                {meeting.sentiment === 'neutral' && <BsEmojiNeutral className={styles.sentimentNeutral} size={16} />}
                {meeting.sentiment === 'negative' && <BsEmojiFrown className={styles.sentimentNegative} size={16} />}
                {meeting.sentiment.charAt(0).toUpperCase() + meeting.sentiment.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedMeeting && (
        <>
          <div className={styles.modalOverlay} onClick={() => setSelectedMeeting(null)} />
          <div className={styles.summaryModal}>
            <div className={styles.summaryContent}>
              <div className={styles.summarySection}>
                <h3>Meeting Summary</h3>
                <p>Summary content for {selectedMeeting.title}</p>
              </div>
              
              <div className={styles.summarySection}>
                <h3>Action Items</h3>
                <div className={styles.actionItems}>
                  {selectedMeeting.keyPoints.map((point, index) => (
                    <div key={index} className={styles.actionItem}>
                      <div className={styles.actionItemNumber}>{index + 1}</div>
                      <div>{point}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.summarySection}>
                <h3>AI Confidence Score</h3>
                <div className={styles.confidenceScore}>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill} 
                      style={{ width: `${selectedMeeting.confidenceScore}%` }} 
                    />
                  </div>
                  <span>{selectedMeeting.confidenceScore}%</span>
                </div>
              </div>

              <div className={styles.summarySection}>
                <h3>Comments</h3>
                <div className={styles.comments}>
                  {/* Example comment */}
                  <div className={styles.comment}>
                    <div className={styles.commentAvatar}>JS</div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>John Smith</span>
                        <span className={styles.commentTime}>2 hours ago</span>
                      </div>
                      <p className={styles.commentText}>
                        Great meeting! Let's follow up on the action items next week.
                      </p>
                    </div>
                  </div>

                  <div className={styles.addComment}>
                    <textarea
                      className={styles.commentInput}
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <button className={styles.sendButton}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MeetingSummarizer;
