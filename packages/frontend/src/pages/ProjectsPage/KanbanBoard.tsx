import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FiSearch, FiFilter, FiPlus, FiX, FiCalendar, FiFlag, FiTag, FiUsers, FiMoreVertical } from 'react-icons/fi';
import styles from './KanbanBoard.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  members: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  progress?: number;
}

interface Column {
  id: string;
  title: string;
  projects: Project[];
  color?: string;
}

const initialData: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6366f1',
    projects: [
      {
        id: '1',
        title: 'AI Integration',
        description: 'Implement AI features across platform',
        members: ['user1.jpg', 'user2.jpg'],
        dueDate: '2024-02-28',
        priority: 'high',
        tags: ['Feature', 'AI'],
        progress: 0
      },
      {
        id: '2',
        title: 'Mobile App',
        description: 'Develop mobile application',
        members: ['user3.jpg'],
        dueDate: '2024-03-15',
        priority: 'medium',
        tags: ['Mobile', 'Development'],
        progress: 0
      }
    ]
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    color: '#eab308',
    projects: [
      {
        id: '3',
        title: 'User Dashboard',
        description: 'Create user dashboard interface',
        members: ['user1.jpg', 'user4.jpg'],
        dueDate: '2024-02-20',
        priority: 'high',
        tags: ['UI', 'Dashboard'],
        progress: 45
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: '#ec4899',
    projects: [
      {
        id: '4',
        title: 'Analytics',
        description: 'Implement analytics dashboard',
        members: ['user2.jpg'],
        dueDate: '2024-02-25',
        priority: 'medium',
        tags: ['Analytics', 'Dashboard'],
        progress: 80
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: '#22c55e',
    projects: [
      {
        id: '5',
        title: 'Authentication',
        description: 'Set up user authentication',
        members: ['user1.jpg', 'user3.jpg'],
        dueDate: '2024-02-15',
        priority: 'high',
        tags: ['Security', 'Backend'],
        progress: 100
      }
    ]
  }
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Project>>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    members: [],
    tags: [],
    progress: 0
  });
  const [filters, setFilters] = useState({
    priority: 'all',
    tags: [] as string[],
    members: [] as string[]
  });

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceProjects = [...sourceColumn.projects];
    const destProjects = source.droppableId === destination.droppableId
      ? sourceProjects
      : [...destColumn.projects];

    const [removed] = sourceProjects.splice(source.index, 1);
    
    // Update progress based on column
    const updatedProject = {
      ...removed,
      progress: destColumn.id === 'done' ? 100 : 
                destColumn.id === 'review' ? 80 :
                destColumn.id === 'inProgress' ? 45 : 0
    };
    
    destProjects.splice(destination.index, 0, updatedProject);

    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return {
          ...col,
          projects: sourceProjects
        };
      }
      if (col.id === destination.droppableId) {
        return {
          ...col,
          projects: destProjects
        };
      }
      return col;
    });

    setColumns(newColumns);
  }, [columns]);

  const addNewProject = useCallback(() => {
    if (!newTask.title) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      members: newTask.members || [],
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority as 'low' | 'medium' | 'high',
      tags: newTask.tags || [],
      progress: 0
    };

    const newColumns = columns.map(col =>
      col.id === 'backlog'
        ? { ...col, projects: [newProject, ...col.projects] }
        : col
    );

    setColumns(newColumns);
    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      members: [],
      tags: [],
      progress: 0
    });
  }, [newTask, columns]);

  const deleteProject = useCallback((columnId: string, projectId: string) => {
    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          projects: col.projects.filter(project => project.id !== projectId)
        };
      }
      return col;
    });
    setColumns(newColumns);
  }, [columns]);

  const filteredColumns = columns.map(column => ({
    ...column,
    projects: column.projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority;
      
      return matchesSearch && matchesPriority;
    })
  }));

  const getColumnProgress = (column: Column) => {
    if (column.projects.length === 0) return 0;
    const totalProgress = column.projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    return Math.round(totalProgress / column.projects.length);
  };

  return (
    <div className={styles.kanbanPage}>
      <div className={styles.kanbanHeader}>
        <div className={styles.headerControls}>
          <div className={styles.searchInput}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.filterButton} onClick={() => {}}>
            <FiFilter />
            Filter
          </button>
        </div>
        <button className={styles.addButton} onClick={() => setIsAddingTask(true)}>
          <FiPlus />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.kanbanContainer}>
          {filteredColumns.map(column => (
            <div key={column.id} className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                <div className={styles.columnTitle}>
                  <h2>{column.title}</h2>
                  <span className={styles.taskCount}>{column.projects.length}</span>
                </div>
                <div className={styles.columnProgress}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: `${getColumnProgress(column)}%`,
                      background: column.color
                    }}
                  />
                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.columnContent}
                  >
                    {column.projects.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.taskCard}
                          >
                            <div className={styles.taskHeader}>
                              <h3 className={styles.taskTitle}>{project.title}</h3>
                              <button
                                className={styles.taskMenu}
                                onClick={() => {}}
                              >
                                <FiMoreVertical />
                              </button>
                            </div>
                            
                            <p className={styles.taskDescription}>
                              {project.description}
                            </p>
                            
                            <div className={styles.taskTags}>
                              {project.tags?.map((tag, i) => (
                                <span key={i} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className={styles.taskMeta}>
                              <div className={styles.taskMembers}>
                                {project.members.map((member, i) => (
                                  <div
                                    key={i}
                                    className={styles.memberAvatar}
                                    style={{
                                      backgroundImage: `url(${member})`,
                                      zIndex: project.members.length - i
                                    }}
                                  >
                                    {!member.includes('.jpg') && member[0].toUpperCase()}
                                  </div>
                                ))}
                              </div>
                              
                              <div className={styles.taskDueDate}>
                                <FiCalendar />
                                {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {project.progress !== undefined && (
                              <div className={styles.columnProgress}>
                                <div
                                  className={styles.progressBar}
                                  style={{
                                    width: `${project.progress}%`,
                                    background: column.color
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isAddingTask && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsAddingTask(false)} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Task</h2>
              <button
                className={styles.modalClose}
                onClick={() => setIsAddingTask(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Title</label>
              <input
                type="text"
                className={styles.formInput}
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={styles.formTextarea}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <select
                className={styles.formSelect}
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Due Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            
            <div className={styles.modalFooter}>
              <button
                className={styles.buttonSecondary}
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </button>
              <button
                className={styles.buttonPrimary}
                onClick={addNewProject}
              >
                Add Task
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
