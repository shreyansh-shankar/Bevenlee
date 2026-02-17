"use client";

import { v4 as uuid } from "uuid";
import { CourseSection } from "./CourseSection";
import { EditableField } from "@/components/ui/EditableField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Checkbox } from "@/components/ui/checkbox";

import { useCourseEditor } from "./editor/CourseEditorContext";
import { DraftSubtopic, DraftTopic } from "@/lib/course/draft";

export function TopicsSection() {
  const { draft, setDraft, markDirty } = useCourseEditor();

  const topics = draft.topics.filter(t => !t.isDeleted);

  function toggleExpanded(id: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
      ),
    }));
  }

  function updateSubtopic(
    topicId: string,
    subId: string,
    patch: Partial<DraftSubtopic>
  ) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId
          ? {
            ...t,
            subtopics: t.subtopics.map(s =>
              s.id === subId ? { ...s, ...patch } : s
            ),
          }
          : t
      ),
    }));
    markDirty();
  }

  function addSubtopic(topicId: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId
          ? {
            ...t,
            subtopics: [
              ...t.subtopics,
              {
                id: `temp_${uuid()}`,
                subtopic_id: null,
                topic_id: topicId,
                title: "New Subtopic",
                is_completed: false,
                position: t.subtopics.length + 1,
                isNew: true,
              },
            ],
            isExpanded: true,
          }
          : t
      ),
    }));
    markDirty();
  }

  function deleteSubtopic(topicId: string, subId: string) {
    setDraft(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId
          ? {
            ...t,
            subtopics: t.subtopics.map(s =>
              s.id === subId
                ? { ...s, isDeleted: true }
                : s
            ),
          }
          : t
      ),
    }));
    markDirty();
  }

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
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-1"
              >
                {topics.map((topic, index) => {
                  const subs = topic.subtopics.filter(
                    s => !s.isDeleted
                  );
                  const completed = subs.filter(
                    s => s.is_completed
                  ).length;

                  return (
                    <Draggable
                      key={topic.id}
                      draggableId={topic.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`rounded transition-colors duration-150 ${snapshot.isDragging
                              ? "bg-gray-100 dark:bg-gray-900"
                              : "hover:bg-gray-50 dark:hover:bg-gray-900"
                            }`}
                        >
                          {/* TOPIC ROW */}
                          <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>

                              <button
                                onClick={() =>
                                  toggleExpanded(topic.id)
                                }
                              >
                                {topic.isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-500" />
                                )}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1 flex-1 ml-2">
                              <EditableField
                                value={topic.title}
                                onChange={v =>
                                  updateTopic(topic.id, {
                                    title: v,
                                  })
                                }
                              >
                                {({
                                  value,
                                  onChange,
                                  onBlur,
                                }) => (
                                  <Input
                                    value={value}
                                    onChange={e =>
                                      onChange(e.target.value)
                                    }
                                    onBlur={onBlur}
                                    className="border-none px-0 py-1 text-base bg-transparent focus:ring-0"
                                  />
                                )}
                              </EditableField>

                              <p className="text-xs text-muted-foreground">
                                {completed}/{subs.length} completed
                              </p>
                            </div>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                deleteTopic(topic.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </Button>
                          </div>

                          {/* SUBTOPICS */}
                          {topic.isExpanded && (
                            <div className="ml-10 pb-2 flex flex-col gap-1">
                              {subs.map(sub => (
                                <div
                                  key={sub.id}
                                  className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                  <Checkbox
                                    checked={sub.is_completed}
                                    onCheckedChange={checked =>
                                      updateSubtopic(
                                        topic.id,
                                        sub.id,
                                        {
                                          is_completed:
                                            !!checked,
                                        }
                                      )
                                    }
                                  />

                                  <EditableField
                                    value={sub.title}
                                    onChange={v =>
                                      updateSubtopic(
                                        topic.id,
                                        sub.id,
                                        { title: v }
                                      )
                                    }
                                  >
                                    {({
                                      value,
                                      onChange,
                                      onBlur,
                                    }) => (
                                      <Input
                                        value={value}
                                        onChange={e =>
                                          onChange(
                                            e.target.value
                                          )
                                        }
                                        onBlur={onBlur}
                                        className={`border-none px-0 py-1 text-sm bg-transparent focus:ring-0 ${sub.is_completed
                                            ? "line-through text-muted-foreground"
                                            : ""
                                          }`}
                                      />
                                    )}
                                  </EditableField>
                                </div>
                              ))}

                              {/* ADD SUBTOPIC */}
                              <button
                                onClick={() =>
                                  addSubtopic(topic.id)
                                }
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2 py-1"
                              >
                                <Plus className="h-3 w-3" />
                                Add subtopic
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </CourseSection>
  );
}
