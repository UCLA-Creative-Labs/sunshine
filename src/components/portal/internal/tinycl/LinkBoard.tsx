'use client';

import { Link } from '@/lib/supabase/linksService';
import LinkCard from './LinkCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface LinkBoardProps {
  links: Link[];
  loading: boolean;
  onEditLink: (link: Link) => void;
  onDeleteLink: (id: string) => void;
  onAddNew: () => void;
  onOrderChange: (newLinks: Link[]) => void;
}

export default function LinkBoard({ 
  links, 
  loading, 
  onEditLink, 
  onDeleteLink, 
  onOrderChange
}: LinkBoardProps) {

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reorderedLinks = Array.from(links);
    const [removed] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, removed);

    // Update positions based on new index
    // Higher position = Top of the list
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      position: reorderedLinks.length - 1 - index
    }));

    onOrderChange(updatedLinks);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20">
      {loading ? (
        <div className="text-center text-gray-500 py-8 text-sm">Loading links...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-list">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="flex flex-col gap-3"
              >
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <LinkCard
                          link={link}
                          onEdit={onEditLink}
                          onDelete={onDeleteLink}
                          dragHandleProps={provided.dragHandleProps}
                        />
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
    </div>
  );
}
