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

  function handleDragOver(_event: DragOverEvent) {
    // handled by dnd-kit
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Determine the target column
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    if (targetColumn) {
      moveTask(activeId, targetColumn.id as TaskStatus);
      return;
    }

    // Dropped on another task — find which column that task belongs to
    const allTasks = COLUMNS.flatMap((col) => getTasksByStatus(col.id));
    const overTask = allTasks.find((t) => t.id === overId);
    if (overTask) {
      const activeTask = allTasks.find((t) => t.id === activeId);
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
        style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          padding: 'var(--spacing-xl)',
          overflowX: 'auto',
          alignItems: 'flex-start',
          minHeight: 'calc(100vh - 200px)',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {COLUMNS.map((column) => (
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
