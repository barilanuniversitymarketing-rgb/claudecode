import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../types';
import { COLUMNS } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanBoard({ onEdit, onAddTask }: KanbanBoardProps) {
  const { getTasksByStatus, moveTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragOver(_event: DragOverEvent) {}

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const targetColumn = COLUMNS.find(c => c.id === overId);
    if (targetColumn) { moveTask(activeId, targetColumn.id as TaskStatus); return; }
    const allTasks = COLUMNS.flatMap(col => getTasksByStatus(col.id));
    const overTask = allTasks.find(t => t.id === overId);
    if (overTask) {
      const activeTask = allTasks.find(t => t.id === activeId);
      if (activeTask && activeTask.status !== overTask.status) {
        moveTask(activeId, overTask.status as TaskStatus);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-6 overflow-x-auto hide-scrollbar items-start"
        style={{
          padding: '1.5rem 2rem 6rem',
          maxWidth: '1600px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 140px)',
        }}
      >
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onEdit={onEdit}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
