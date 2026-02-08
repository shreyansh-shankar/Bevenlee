"use client";

import { v4 as uuid } from "uuid";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { useCourseEditor } from "./editor/CourseEditorContext";
import { DraftTopic } from "@/lib/course/draft";

export function TopicsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const topics = draft.topics.filter(t => !t.isDeleted);

  function updateTopic(
    id: string,
    patch: Partial<DraftTopic>
  ) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }));
    markDirty();
  }

  function addTopic() {
    setDraft(d => ({
      ...d,
      topics: [
        ...d.topics,
        {
          id: `temp_${uuid()}`,
          topic_id: null,
          title: "New Topic",
          status: "Not Started",
          position: d.topics.length + 1,
          subtopics: [],
          isNew: true,
        },
      ],
    }));
    markDirty();
  }

  function deleteTopic(id: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id
          ? { ...t, isDeleted: true }
          : t
      ),
    }));
    markDirty();
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;

    const reordered = Array.from(topics);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update positions and draft
    setDraft(d => ({
      ...d,
      topics: reordered.map((t, i) => ({ ...t, position: i + 1 })),
    }));
    markDirty();
  }

  return (
    <CourseSection
      title="Topics"
      description="Course syllabus structure"
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={addTopic}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add topic
        </Button>
      }
    >
      {topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No topics added yet.
        </p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics">
            {provided => (
              <div
                className="flex flex-col gap-1"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {topics.map((topic, index) => (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center justify-between py-2 px-2 rounded transition-colors duration-150 ${snapshot.isDragging
                            ? "bg-gray-100 dark:bg-gray-900"
                            : "hover:bg-gray-50 dark:hover:bg-gray-900"
                          }`}
                      >
                        {/* Drag handle icon */}
                        <div {...provided.dragHandleProps} className="mr-3 cursor-grab">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                          <EditableField
                            value={topic.title}
                            onChange={v => updateTopic(topic.id, { title: v })}
                            className="font-medium"
                          >
                            {({ value, onChange, onBlur }) => (
                              <Input
                                value={value}
                                onChange={e => onChange(e.target.value)}
                                onBlur={onBlur}
                                placeholder="Topic title"
                                className="border-none px-0 py-1 text-base focus:ring-0 focus:outline-none bg-transparent"
                              />
                            )}
                          </EditableField>

                          <p className="text-xs text-muted-foreground">
                            {topic.subtopics.filter(s => !s.isDeleted).length} subtopics
                          </p>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTopic(topic.id)}
                        >
                          <Trash2 className="h-4 w-4 text-white-500 hover:text-white-600" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </CourseSection>
  );
}
