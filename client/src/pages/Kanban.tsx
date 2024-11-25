import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FiPlus, FiMoreVertical, FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import './Kanban.css';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  tags: string[];
  estimatedTime: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    tasks: [
      {
        id: 't1',
        title: 'Design System',
        description: 'Create a comprehensive design system for consistent UI/UX',
        dueDate: '2024-03-15',
        priority: 'high',
        assignees: ['John D.', 'Sarah M.'],
        tags: ['design', 'ui/ux'],
        estimatedTime: '40h',
        status: 'todo'
      },
      {
        id: 't2',
        title: 'Homepage Layout',
        description: 'Implement new homepage design with responsive layout',
        dueDate: '2024-03-20',
        priority: 'medium',
        assignees: ['Mike R.'],
        tags: ['frontend'],
        estimatedTime: '24h',
        status: 'in-progress'
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile app for iOS and Android',
    tasks: [
      {
        id: 't3',
        title: 'User Authentication',
        description: 'Implement secure authentication flow',
        dueDate: '2024-03-10',
        priority: 'high',
        assignees: ['Alex K.'],
        tags: ['security', 'backend'],
        estimatedTime: '16h',
        status: 'review'
      }
    ]
  }
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

const KanbanPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (selectedProject) {
      setTasks(selectedProject.tasks);
    }
  }, [selectedProject]);

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !selectedProject) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const draggedTask = updatedTasks.find(t => t.id === draggableId);

    if (!draggedTask) return;

    // Remove from source
    updatedTasks.splice(
      updatedTasks.findIndex(t => t.id === draggableId),
      1
    );

    // Add to destination
    draggedTask.status = destination.droppableId as Task['status'];
    const insertIndex = updatedTasks.filter(t => t.status === destination.droppableId).length;
    updatedTasks.splice(
      updatedTasks.findIndex(t => t.status === destination.droppableId) + insertIndex,
      0,
      draggedTask
    );

    setTasks(updatedTasks);

    // Update project tasks
    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, tasks: updatedTasks }
        : p
    );
    setProjects(updatedProjects);
  };

  const addNewTask = (status: Task['status']) => {
    if (!selectedProject) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      title: 'New Task',
      description: 'Add task description',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      assignees: [],
      tags: [],
      estimatedTime: '0h',
      status
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, tasks: updatedTasks }
        : p
    );
    setProjects(updatedProjects);
  };

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <div className="project-selector">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="project-select"
          >
            <option value="">Select a Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {selectedProject && (
            <p className="project-description">{selectedProject.description}</p>
          )}
        </div>
        <button className="new-task-btn" onClick={() => addNewTask('todo')}>
          <FiPlus /> New Task
        </button>
      </div>

      {selectedProject ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-container">
            {columns.map(column => (
              <div key={column.id} className="kanban-column">
                <div className="column-header">
                  <h2>{column.title}</h2>
                  <span className="task-count">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {tasks
                        .filter(task => task.status === column.id)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              >
                                <div className="task-header">
                                  <h3>{task.title}</h3>
                                  <button className="task-menu">
                                    <FiMoreVertical />
                                  </button>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <div className="task-meta">
                                  <div className="task-info">
                                    <span className="task-due-date">
                                      <FiCalendar />
                                      {task.dueDate}
                                    </span>
                                    <span className="task-time">
                                      <FiClock />
                                      {task.estimatedTime}
                                    </span>
                                  </div>
                                  <div className="task-tags">
                                    {task.tags.map((tag, i) => (
                                      <span key={i} className="tag">
                                        <FiTag />
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="task-footer">
                                  <div className="task-assignees">
                                    {task.assignees.map((assignee, i) => (
                                      <div
                                        key={i}
                                        className="assignee-avatar"
                                        title={assignee}
                                      >
                                        {assignee.charAt(0)}
                                      </div>
                                    ))}
                                  </div>
                                  <div className={`task-priority ${task.priority}`}>
                                    {task.priority}
                                  </div>
                                </div>
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
      ) : (
        <div className="no-project-selected">
          <h2>Select a Project</h2>
          <p>Choose a project from the dropdown above to view its Kanban board.</p>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
